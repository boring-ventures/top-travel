"use client";

import { Badge } from "./badge";

type StatusValue = string | undefined | null;

function getClassesForStatus(status: string) {
  const s = status.toUpperCase();
  switch (s) {
    case "PUBLISHED":
    case "APPROVED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "PENDING":
    case "DRAFT":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "REJECTED":
    case "ERROR":
      return "bg-rose-100 text-rose-800 border-rose-200";
    case "ARCHIVED":
      return "bg-slate-100 text-slate-800 border-slate-200";
    default:
      return "bg-secondary text-secondary-foreground border-secondary/50";
  }
}

function getStatusLabel(status: string) {
  const s = status.toUpperCase();
  switch (s) {
    case "PUBLISHED":
      return "Publicado";
    case "APPROVED":
      return "Aprobado";
    case "PENDING":
      return "Pendiente";
    case "DRAFT":
      return "Borrador";
    case "REJECTED":
      return "Rechazado";
    case "ERROR":
      return "Error";
    case "ARCHIVED":
      return "Archivado";
    default:
      return status;
  }
}

export function StatusBadge({ status }: { status: StatusValue }) {
  if (!status) return null;
  return (
    <Badge variant="outline" className={getClassesForStatus(String(status))}>
      {getStatusLabel(String(status))}
    </Badge>
  );
}
