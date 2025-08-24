import { Metadata } from "next";
import { QuinceaneraDestinationsTable } from "@/components/admin/cms/quinceanera-destinations";

export const metadata: Metadata = {
  title: "Destinos de Quinceañeras | CMS",
  description: "Gestiona los destinos especializados para quinceañeras",
};

export default function QuinceaneraDestinationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Destinos de Quinceañeras
        </h1>
        <p className="text-muted-foreground">
          Gestiona los destinos especializados para quinceañeras de destino
        </p>
      </div>
      <QuinceaneraDestinationsTable />
    </div>
  );
}
