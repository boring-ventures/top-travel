import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold">Página no encontrada</h1>
        <p className="text-muted-foreground">La página que buscas no existe o fue movida.</p>
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}


