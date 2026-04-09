"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Patient, PatientStatus, PatientWithIntake } from "@/types/supabase";
import PatientCard from "./PatientCard";
import PatientSlideOver from "./PatientSlideOver";
import { Users } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

const COLUMNS: { status: PatientStatus; label: string; color: string }[] = [
  { status: "Lead",           label: "Leads",    color: "border-t-slate-400" },
  { status: "Consult_Booked", label: "Consulta", color: "border-t-amber-500" },
  { status: "Surgery_Booked", label: "Cirugía",  color: "border-t-blue-500"  },
  { status: "Post_Op",        label: "Post-Op",  color: "border-t-green-500" },
  { status: "Discharged",     label: "Alta",     color: "border-t-stone-400" },
];

/* ── Droppable Column wrapper ─────────────────────────────────── */
function DroppableColumn({
  status,
  label,
  color,
  patients,
  activeId,
  onCardClick,
}: {
  status: PatientStatus;
  label: string;
  color: string;
  patients: Patient[];
  activeId: string | null;
  onCardClick: (p: Patient) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const ids = patients.map((p) => p.id);

  return (
    <div key={status} className="flex flex-col gap-3">
      {/* Column header */}
      <div className={`rounded-sm border border-slate-200 border-t-2 bg-white px-3 py-2 ${color}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
            {label}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
            {patients.length}
          </span>
        </div>
      </div>

      {/* Cards container */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-[120px] rounded-sm p-1 transition-all ${
          isOver ? "ring-2 ring-amber-400 bg-amber-50/30" : ""
        }`}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {patients.length === 0 ? (
            <div className="rounded-sm border border-dashed border-slate-200 p-4 text-center text-xs text-slate-300">
              Sin pacientes
            </div>
          ) : (
            patients.map((p) => (
              <div key={p.id} className={activeId === p.id ? "opacity-0" : ""}>
                <PatientCard patient={p} onClick={onCardClick} />
              </div>
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}

/* ── Main KanbanBoard component ───────────────────────────────── */
export default function KanbanBoard() {
  const supabase = createClient();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<PatientWithIntake | null>(null);
  const [slideOpen, setSlideOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Drag-and-drop state
  const [activeId, setActiveId] = useState<string | null>(null);
  const previousStatus = useRef<Map<string, PatientStatus>>(new Map());

  // Sensors — PointerSensor with small activation distance to avoid accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const fetchPatients = useCallback(async () => {
    const { data } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPatients(data as Patient[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchPatients();

    // Targeted realtime subscription
    const channel = supabase
      .channel("patients-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "patients" },
        (payload) => {
          const newPatient = payload.new as Patient;
          setPatients((prev) => {
            if (prev.some((p) => p.id === newPatient.id)) return prev;
            return [newPatient, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "patients" },
        (payload) => {
          const updated = payload.new as Patient;
          setPatients((prev) =>
            prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "patients" },
        (payload) => {
          const deleted = payload.old as { id: string };
          setPatients((prev) => prev.filter((p) => p.id !== deleted.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPatients, supabase]);

  /* ── Drag handlers ──────────────────────────────────────────── */
  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    setActiveId(id);
    // Snapshot current status for rollback
    const patient = patients.find((p) => p.id === id);
    if (patient) {
      previousStatus.current.set(id, patient.status);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const patientId = String(active.id);
    const overId = String(over.id);
    const validStatuses = COLUMNS.map((c) => c.status);

    // over.id is either a column status string OR a card UUID —
    // if it's a card, find which column that card lives in
    const targetStatus = (
      validStatuses.includes(overId as PatientStatus)
        ? overId
        : patients.find((p) => p.id === overId)?.status
    ) as PatientStatus | undefined;

    if (!targetStatus || !validStatuses.includes(targetStatus)) return;

    const patient = patients.find((p) => p.id === patientId);
    if (!patient || patient.status === targetStatus) return;

    // Optimistic update
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: targetStatus } : p))
    );

    // Persist to database
    const { error } = await supabase
      .from("patients")
      .update({ status: targetStatus } as never)
      .eq("id", patientId);

    if (error) {
      // Revert from snapshot
      const prevStatus = previousStatus.current.get(patientId);
      if (prevStatus) {
        setPatients((prev) =>
          prev.map((p) => (p.id === patientId ? { ...p, status: prevStatus } : p))
        );
      }
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del paciente",
        variant: "destructive",
      });
    }

    previousStatus.current.delete(patientId);
  };

  const handleCardClick = async (patient: Patient) => {
    const [{ data: intake }, { data: appointments }, { data: messages }] = await Promise.all([
      supabase.from("medical_intake").select("*").eq("patient_id", patient.id).single(),
      supabase.from("appointments").select("*").eq("patient_id", patient.id).order("appointment_date"),
      supabase.from("messages").select("*").eq("patient_id", patient.id).order("created_at", { ascending: true }),
    ]);

    setSelected({
      ...patient,
      medical_intake: intake ?? null,
      appointments: appointments ?? [],
      messages: messages ?? [],
    });
    setSlideOpen(true);
  };

  const handleStatusChange = (id: string, status: PatientStatus) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, status } : prev));
    }
  };

  const byStatus = (status: PatientStatus) =>
    patients.filter((p) => p.status === status);

  // Find the active patient for DragOverlay
  const activePatient = activeId ? patients.find((p) => p.id === activeId) ?? null : null;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400 text-sm">
        Cargando pacientes…
      </div>
    );
  }

  return (
    <>
      {/* Stats bar */}
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Users className="h-4 w-4 text-amber-600" />
        <span>{patients.length} pacientes en total</span>
        <span className="mx-2 text-slate-200">|</span>
        <span className="text-amber-700 font-medium">
          {byStatus("Lead").length} leads activos
        </span>
      </div>

      {/* Kanban columns with DndContext */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {COLUMNS.map(({ status, label, color }) => (
            <DroppableColumn
              key={status}
              status={status}
              label={label}
              color={color}
              patients={byStatus(status)}
              activeId={activeId}
              onCardClick={handleCardClick}
            />
          ))}
        </div>

        {/* DragOverlay — ghost card during drag */}
        <DragOverlay>
          {activePatient ? (
            <div className="shadow-lg rotate-2">
              <PatientCard
                patient={activePatient}
                onClick={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <PatientSlideOver
        patient={selected}
        open={slideOpen}
        onClose={() => setSlideOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
