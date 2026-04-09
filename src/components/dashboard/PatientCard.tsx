"use client";

import { Patient } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "@/lib/dateUtils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface PatientCardProps {
  patient: Patient;
  onClick: (patient: Patient) => void;
}

const statusBadgeMap: Record<Patient["status"], React.ComponentProps<typeof Badge>["variant"]> = {
  Lead:           "lead",
  Consult_Booked: "consult",
  Surgery_Booked: "surgery",
  Post_Op:        "postop",
  Discharged:     "discharged",
};

export default function PatientCard({ patient, onClick }: PatientCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: patient.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-full rounded-sm border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-amber-300 hover:shadow-md ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle — listeners only on grip icon */}
        <button
          type="button"
          className="mt-0.5 cursor-grab touch-none text-slate-300 hover:text-slate-500 focus-visible:outline-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Card content — click opens slide-over */}
        <button
          type="button"
          onClick={() => onClick(patient)}
          className="flex-1 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-600 rounded-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="font-medium text-slate-900 text-sm leading-snug">
              {patient.full_name}
            </span>
            <Badge variant={statusBadgeMap[patient.status]}>
              {patient.language_preference.toUpperCase()}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {formatDistanceToNow(patient.created_at)}
          </p>
          {patient.email && (
            <p className="mt-1 truncate text-xs text-slate-500">{patient.email}</p>
          )}
        </button>
      </div>
    </div>
  );
}
