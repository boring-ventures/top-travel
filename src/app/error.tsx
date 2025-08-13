"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function RootError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold">Algo salió mal</h1>
        <p className="text-muted-foreground">Por favor, intenta refrescar la página o vuelve al inicio.</p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => reset()}>Reintentar</Button>
          <Button asChild variant="outline">
            <a href="/">Volver al inicio</a>
          </Button>
        </div>
      </div>
    </div>
  );
}


