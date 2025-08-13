"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ListHeaderProps = {
  title: string;
  description?: string;
  className?: string;
  actions?: ReactNode;
  children?: ReactNode; // filters / search
};

export const ListHeader = ({
  title,
  description,
  className,
  actions,
  children,
}: ListHeaderProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  );
};




