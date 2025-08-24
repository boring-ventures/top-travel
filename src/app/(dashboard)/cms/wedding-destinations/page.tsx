import { Metadata } from "next";
import { WeddingDestinationsTable } from "@/components/admin/cms/wedding-destinations";

export const metadata: Metadata = {
  title: "Destinos de Bodas | CMS",
  description: "Gestiona los destinos especializados para bodas",
};

export default function WeddingDestinationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Destinos de Bodas</h1>
        <p className="text-muted-foreground">
          Gestiona los destinos especializados para bodas de destino
        </p>
      </div>
      <WeddingDestinationsTable />
    </div>
  );
}
