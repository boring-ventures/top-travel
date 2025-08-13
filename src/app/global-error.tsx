"use client";

import { Button } from "@/components/ui/button";

export default function GlobalAppError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold">Error de aplicación</h1>
        <p className="text-muted-foreground">Ocurrió un error inesperado.</p>
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


