"use client";

import { ReactNode } from "react";
import { useCmsAuth } from "@/hooks/use-cms-auth";
import { Loader } from "@/components/ui/loader";

interface CmsAuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function CmsAuthGuard({ children, fallback }: CmsAuthGuardProps) {
  const { isAuthorized, isLoading } = useCmsAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8" />
      </div>
    );
  }

  if (!isAuthorized) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Acceso Denegado</h2>
          <p className="text-muted-foreground">
            No tienes permisos para acceder a esta sección.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
