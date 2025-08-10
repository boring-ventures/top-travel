import WhatsAppCTA from "@/components/utils/whatsapp-cta";

export default function ContactPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  return (
    <div className="container mx-auto py-10 space-y-6 max-w-3xl">
      <h1 className="text-3xl font-semibold">Contacto</h1>
      <p className="text-muted-foreground">
        Escríbenos por WhatsApp para cotizaciones, paquetes personalizados,
        eventos y más.
      </p>

      <div className="space-y-2 text-sm">
        <div>
          WhatsApp: <span className="font-medium">{phone || "—"}</span>
        </div>
        <div>Oficinas: Santa Cruz, Cochabamba y La Paz</div>
      </div>

      <div>
        <WhatsAppCTA
          label="Chatear por WhatsApp"
          template="Hola! Quiero más información."
          variables={{}}
          campaign="contact_page"
        />
      </div>
    </div>
  );
}
