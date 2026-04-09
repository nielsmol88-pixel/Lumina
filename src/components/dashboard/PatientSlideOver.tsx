"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PatientWithIntake, PatientStatus, AppointmentType, Message } from "@/types/supabase";
import { Phone, Mail, MessageCircle, Loader2, ChevronDown, Plus, Send, Calendar, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast-provider";

interface Props {
  patient: PatientWithIntake | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: PatientStatus) => void;
}

const STATUS_OPTIONS: PatientStatus[] = ["Lead","Consult_Booked","Surgery_Booked","Post_Op","Discharged"];
const STATUS_LABELS: Record<PatientStatus, string> = {
  Lead: "Lead", Consult_Booked: "Consulta reservada",
  Surgery_Booked: "Cirugía reservada", Post_Op: "Post-operatorio", Discharged: "Alta",
};
const WHATSAPP_TEMPLATES = [
  { id: "lead_received",   label: "Bienvenida" },
  { id: "consult_confirm", label: "Confirmar consulta" },
  { id: "surgery_confirm", label: "Confirmar cirugía" },
  { id: "postop_day1",     label: "Post-Op Día 1" },
  { id: "postop_day7",     label: "Post-Op Día 7" },
];
const APPT_TYPES: { value: AppointmentType; label: string }[] = [
  { value: "Tele_Audit",            label: "Tele-Auditoría (Zoom)" },
  { value: "In_Person_Diagnostics", label: "Diagnóstico presencial" },
  { value: "Surgery",               label: "Cirugía" },
];
type Tab = "info" | "chat" | "appointments";

export default function PatientSlideOver({ patient, open, onClose, onStatusChange }: Props) {
  // Cast to any to avoid Supabase generic type inference issues with new tables
  const supabase = createClient() as any; // eslint-disable-line
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("info");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [loadingWA, setLoadingWA] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [outboundText, setOutboundText] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [showNewAppt, setShowNewAppt] = useState(false);
  const [apptType, setApptType] = useState<AppointmentType>("Tele_Audit");
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [apptNotes, setApptNotes] = useState("");
  const [savingAppt, setSavingAppt] = useState(false);
  const [appointments, setAppointments] = useState(patient?.appointments ?? []);

  useEffect(() => {
    setNotes(patient?.notes ?? "");
    setNotesSaved(false);
    setTab("info");
    setShowNewAppt(false);
    setAppointments(patient?.appointments ?? []);
  }, [patient?.id]);

  useEffect(() => {
    if (tab !== "chat" || !patient) return;
    setLoadingMsgs(true);
    supabase.from("messages").select("*").eq("patient_id", patient.id)
      .order("created_at", { ascending: true })
      .then(({ data }: { data: Message[] }) => { setMsgs(data ?? []); setLoadingMsgs(false); });

    const channel = supabase.channel(`msgs-${patient.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `patient_id=eq.${patient.id}` },
        (payload: { new: Message }) => setMsgs((prev) => [...prev, payload.new]))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tab, patient?.id]);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  if (!patient) return null;

  const formattedDate = new Date(patient.created_at).toLocaleString("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const handleStatusChange = async (newStatus: PatientStatus) => {
    setUpdatingStatus(true);
    const { error } = await supabase.from("patients").update({ status: newStatus }).eq("id", patient.id);
    if (!error) {
      onStatusChange(patient.id, newStatus);
      fetch("/api/status-change", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patient.id, new_status: newStatus }),
      }).catch(() => {});
    }
    setUpdatingStatus(false);
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    const { error } = await supabase.from("patients").update({ notes }).eq("id", patient.id);
    setSavingNotes(false);
    if (error) toast({ title: "Error", description: "No se pudo guardar la nota", variant: "destructive" });
    else { setNotesSaved(true); setTimeout(() => setNotesSaved(false), 2000); }
  };

  const handleWhatsApp = async (templateId: string, templateLabel: string) => {
    setLoadingWA(templateId);
    try {
      const res = await fetch("/api/whatsapp-trigger", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patient.id, phone: patient.phone, template_id: templateId, language: patient.language_preference }),
      });
      toast(res.ok ? { title: "WhatsApp enviado", description: templateLabel } : { title: "Error", description: "Error enviando WhatsApp", variant: "destructive" });
    } catch { toast({ title: "Error", description: "Error enviando WhatsApp", variant: "destructive" }); }
    finally { setLoadingWA(null); }
  };

  const handleSendMessage = async () => {
    if (!outboundText.trim()) return;
    setSendingMsg(true);
    const body = outboundText.trim();
    setOutboundText("");
    setMsgs((prev) => [...prev, { id: `opt-${Date.now()}`, created_at: new Date().toISOString(), patient_id: patient.id, direction: "outbound", body, template_id: null, wati_id: null, read_at: null }]);
    await supabase.from("messages").insert({ patient_id: patient.id, direction: "outbound", body });
    setSendingMsg(false);
  };

  const handleCreateAppointment = async () => {
    if (!apptDate || !apptTime) { toast({ title: "Error", description: "Selecciona fecha y hora", variant: "destructive" }); return; }
    setSavingAppt(true);
    const appointmentDate = new Date(`${apptDate}T${apptTime}:00`).toISOString();
    const { data, error } = await supabase.from("appointments")
      .insert({ patient_id: patient.id, appointment_date: appointmentDate, appointment_type: apptType, status: "Scheduled", notes: apptNotes || null })
      .select().single();
    setSavingAppt(false);
    if (error) { toast({ title: "Error", description: "No se pudo crear la cita", variant: "destructive" }); return; }
    setAppointments((prev: typeof appointments) => [...prev, data]);
    setShowNewAppt(false); setApptDate(""); setApptTime(""); setApptNotes("");
    toast({ title: "Cita creada", description: APPT_TYPES.find(t => t.value === apptType)?.label ?? "" });
    const tplMap: Partial<Record<AppointmentType, string>> = { Tele_Audit: "consult_confirm", In_Person_Diagnostics: "consult_confirm", Surgery: "surgery_confirm" };
    const tpl = tplMap[apptType];
    if (tpl) handleWhatsApp(tpl, "Confirmación de cita");
  };

  const sortedAppointments = [...appointments].sort((a: { appointment_date: string }, b: { appointment_date: string }) =>
    new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime());
  const unreadCount = msgs.filter((m: Message) => m.direction === "inbound" && !m.read_at).length;
  const intake = patient.medical_intake;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex flex-col max-h-[90vh] w-full max-w-lg p-0 gap-0">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-slate-100">
          <DialogTitle className="text-base">{patient.full_name}</DialogTitle>
          <p className="text-xs text-slate-400">ID: {patient.id.slice(0, 8)}… · Ingresó {formattedDate}</p>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6">
          {(["info", "chat", "appointments"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`py-2.5 px-3 text-xs font-medium transition-colors ${tab === t ? "text-amber-700 border-b-2 border-amber-600" : "text-slate-400 hover:text-slate-600"}`}>
              {t === "info" && "Información"}
              {t === "chat" && (<>Conversación{unreadCount > 0 && <span className="ml-1.5 rounded-full bg-amber-600 px-1.5 py-0.5 text-[10px] text-white">{unreadCount}</span>}</>)}
              {t === "appointments" && `Citas (${appointments.length})`}
            </button>
          ))}
        </div>

        {/* INFO TAB */}
        {tab === "info" && (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            <section className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-widest text-slate-400">Contacto</h3>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Phone className="h-3.5 w-3.5 text-amber-600" />
                <a href={`tel:${patient.phone}`} className="hover:underline">{patient.phone}</a>
              </div>
              {patient.email && (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Mail className="h-3.5 w-3.5 text-amber-600" />
                  <a href={`mailto:${patient.email}`} className="hover:underline">{patient.email}</a>
                </div>
              )}
              {patient.date_of_birth && <p className="text-xs text-slate-500">Nacimiento: {new Date(patient.date_of_birth).toLocaleDateString("es-ES")}</p>}
              {patient.how_did_you_hear && <p className="text-xs text-slate-500">Cómo nos conoció: {patient.how_did_you_hear}</p>}
              {patient.preferred_contact && (
                <p className="text-xs text-slate-500">Contacto preferido: {{ morning: "Mañana", afternoon: "Tarde", anytime: "Cualquier hora" }[patient.preferred_contact]}</p>
              )}
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-widest text-slate-400">Estado</h3>
              <div className="relative">
                <select value={patient.status} onChange={(e) => handleStatusChange(e.target.value as PatientStatus)} disabled={updatingStatus}
                  className="w-full appearance-none rounded-sm border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-amber-600 disabled:opacity-50">
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-400">Cambiar estado envía WhatsApp automáticamente</p>
            </section>

            {intake && (
              <section className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-widest text-slate-400">Datos clínicos</h3>
                {intake.area_of_interest && <div><p className="text-xs text-slate-400">Área de interés</p><p className="text-sm text-slate-800">{intake.area_of_interest}</p></div>}
                <div><p className="text-xs text-slate-400">Motivo de consulta</p><p className="text-sm text-slate-800 leading-relaxed">{intake.chief_complaint}</p></div>
                {intake.dry_eye_risk_score !== null && (
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-400">Riesgo ojo seco</p>
                    <Badge variant={intake.dry_eye_risk_score > 6 ? "surgery" : "lead"}>{intake.dry_eye_risk_score}/10</Badge>
                  </div>
                )}
              </section>
            )}

            <section className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-widest text-slate-400">Enviar WhatsApp</h3>
              <div className="grid grid-cols-2 gap-2">
                {WHATSAPP_TEMPLATES.map((tpl) => (
                  <Button key={tpl.id} variant="outline" size="sm" onClick={() => handleWhatsApp(tpl.id, tpl.label)} disabled={loadingWA !== null} className="justify-start gap-1.5 text-xs">
                    {loadingWA === tpl.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <MessageCircle className="h-3 w-3 text-green-600" />}
                    {tpl.label}
                  </Button>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-widest text-slate-400">Notas internas</h3>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Observaciones, próximos pasos…"
                className="w-full rounded-sm border border-slate-300 bg-white p-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-600" />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveNotes} disabled={savingNotes} className="text-xs">
                  {savingNotes ? <Loader2 className="h-3 w-3 animate-spin" /> : "Guardar nota"}
                </Button>
                {notesSaved && <span className="text-xs text-green-600">✓ Guardado</span>}
              </div>
            </section>
          </div>
        )}

        {/* CHAT TAB */}
        {tab === "chat" && (
          <div className="flex flex-col" style={{ height: "420px" }}>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
              {loadingMsgs && <div className="flex justify-center py-8"><Loader2 className="h-4 w-4 animate-spin text-slate-300" /></div>}
              {!loadingMsgs && msgs.length === 0 && <p className="text-center text-xs text-slate-300 py-8">Sin mensajes aún</p>}
              {msgs.map((msg: Message) => (
                <div key={msg.id} className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${msg.direction === "outbound" ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                    <p>{msg.body}</p>
                    <p className={`mt-0.5 text-[10px] ${msg.direction === "outbound" ? "text-amber-200" : "text-slate-400"}`}>
                      {new Date(msg.created_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>
            <div className="border-t border-slate-100 px-4 py-3 flex gap-2">
              <input type="text" value={outboundText} onChange={(e) => setOutboundText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder="Escribe un mensaje…"
                className="flex-1 rounded-sm border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-600" />
              <Button size="sm" onClick={handleSendMessage} disabled={sendingMsg || !outboundText.trim()} className="bg-amber-600 hover:bg-amber-700 text-white">
                {sendingMsg ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {tab === "appointments" && (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {sortedAppointments.length === 0 && !showNewAppt && <p className="text-xs text-slate-400 text-center py-4">Sin citas programadas</p>}
            {sortedAppointments.map((apt: { id: string; appointment_date: string; appointment_type: AppointmentType; status: string; notes: string | null }) => (
              <div key={apt.id} className="rounded-sm border border-slate-100 px-4 py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800">{APPT_TYPES.find(t => t.value === apt.appointment_type)?.label ?? apt.appointment_type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${apt.status === "Confirmed" ? "bg-green-100 text-green-700" : apt.status === "Completed" ? "bg-slate-100 text-slate-500" : apt.status === "Cancelled" ? "bg-red-100 text-red-600" : "bg-amber-50 text-amber-700"}`}>{apt.status}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(apt.appointment_date).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(apt.appointment_date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                {apt.notes && <p className="text-xs text-slate-400">{apt.notes}</p>}
              </div>
            ))}
            {showNewAppt ? (
              <div className="rounded-sm border border-amber-200 bg-amber-50/30 p-4 space-y-3">
                <p className="text-xs font-medium text-slate-700">Nueva cita</p>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Tipo</label>
                  <select value={apptType} onChange={(e) => setApptType(e.target.value as AppointmentType)}
                    className="w-full rounded-sm border border-slate-300 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-600">
                    {APPT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Fecha</label>
                    <input type="date" value={apptDate} onChange={(e) => setApptDate(e.target.value)}
                      className="w-full rounded-sm border border-slate-300 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-600" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Hora</label>
                    <input type="time" value={apptTime} onChange={(e) => setApptTime(e.target.value)}
                      className="w-full rounded-sm border border-slate-300 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-600" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Notas (opcional)</label>
                  <input type="text" value={apptNotes} onChange={(e) => setApptNotes(e.target.value)} placeholder="Zoom link, instrucciones…"
                    className="w-full rounded-sm border border-slate-300 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-600" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreateAppointment} disabled={savingAppt} className="bg-amber-600 hover:bg-amber-700 text-white text-xs">
                    {savingAppt ? <Loader2 className="h-3 w-3 animate-spin" /> : "Crear cita"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowNewAppt(false)} className="text-xs">Cancelar</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowNewAppt(true)} className="w-full gap-1.5 text-xs border-dashed">
                <Plus className="h-3.5 w-3.5" />Nueva cita
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
