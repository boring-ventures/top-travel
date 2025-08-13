"use client";

import { Badge } from "./badge";

type StatusValue = string | undefined | null;

function getClassesForStatus(status: string) {
  const s = status.toUpperCase();
  switch (s) {
    case "PUBLISHED":
    case "APPROVED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
    case "PENDING":
    case "DRAFT":
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
    case "REJECTED":
    case "ERROR":
      return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800";
    case "ARCHIVED":
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800";
    default:
      return "bg-secondary text-secondary-foreground border-secondary/50";
  }
}

export function StatusBadge({ status }: { status: StatusValue }) {
  if (!status) return null;
  return (
    <Badge variant="outline" className={getClassesForStatus(String(status))}>
      {String(status)}
    </Badge>
  );
}





