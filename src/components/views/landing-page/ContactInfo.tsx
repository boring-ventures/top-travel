"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, MessageCircle, Globe } from "lucide-react";
import Link from "next/link";
import { ShineBorder } from "@/components/magicui/shine-border";

const contactInfo = {
  emails: [
    "info@toptravel.com",
    "reservas@toptravel.com",
    "bodas@toptravel.com",
    "quinceanera@toptravel.com",
  ],
  phones: [
    {
      number: "+591 2 1234567",
      label: "Oficina Principal",
      hours: "Lun-Vie: 8:00 - 18:00",
    },
    {
      number: "+591 700 12345",
      label: "WhatsApp",
      hours: "24/7",
    },
    {
      number: "+591 700 67890",
      label: "Emergencias",
      hours: "24/7",
    },
  ],
  locations: [
    {
      address: "Av. 16 de Julio 1234",
      city: "La Paz",
      country: "Bolivia",
      label: "Oficina Principal",
      hours: "Lun-Vie: 8:00 - 18:00",
    },
    {
      address: "Calle Comercio 567",
      city: "Santa Cruz",
      country: "Bolivia",
      label: "Sucursal Santa Cruz",
      hours: "Lun-Vie: 8:00 - 18:00",
    },
  ],
  social: [
    {
      name: "Facebook",
      url: "https://facebook.com/toptravel",
      icon: Globe,
    },
    {
      name: "Instagram",
      url: "https://instagram.com/toptravel",
      icon: Globe,
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/59170012345",
      icon: MessageCircle,
    },
  ],
};

export default function ContactInfo() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
          Información de Contacto
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Estamos aquí para ayudarte a planificar tu próximo viaje inolvidable
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Emails */}
        <ShineBorder className="rounded-xl w-full" borderWidth={1}>
          <Card className="h-full bg-transparent border-0">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Email
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              {contactInfo.emails.map((email, index) => (
                <div key={index} className="text-sm">
                  <a
                    href={`mailto:${email}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {email}
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        </ShineBorder>

        {/* Phones */}
        <ShineBorder className="rounded-xl w-full" borderWidth={1}>
          <Card className="h-full bg-transparent border-0">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Teléfonos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              {contactInfo.phones.map((phone, index) => (
                <div key={index} className="text-sm space-y-1">
                  <div className="font-medium text-foreground">
                    {phone.label}
                  </div>
                  <a
                    href={`tel:${phone.number.replace(/\s/g, "")}`}
                    className="text-green-600 hover:text-green-800 transition-colors block"
                  >
                    {phone.number}
                  </a>
                  <div className="text-xs text-muted-foreground">
                    {phone.hours}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </ShineBorder>

        {/* Locations */}
        <ShineBorder className="rounded-xl w-full" borderWidth={1}>
          <Card className="h-full bg-transparent border-0">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Oficinas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              {contactInfo.locations.map((location, index) => (
                <div key={index} className="text-sm space-y-1">
                  <div className="font-medium text-foreground">
                    {location.label}
                  </div>
                  <div className="text-muted-foreground">
                    {location.address}
                  </div>
                  <div className="text-muted-foreground">
                    {location.city}, {location.country}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {location.hours}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </ShineBorder>
      </div>

      {/* Social Media & CTA */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 sm:p-12">
          <div className="flex items-center justify-center mb-6">
            <ShineBorder className="rounded-full p-3" borderWidth={1}>
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </ShineBorder>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 text-foreground">
            ¿Listo para Planificar tu Viaje?
          </h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Contáctanos hoy para una consulta gratuita y comienza a crear
            recuerdos inolvidables
          </p>

          {/* Social Media Links */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {contactInfo.social.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg"
                >
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </a>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              variant="default"
              size="lg"
              className="rounded-full"
            >
              <Link href="/contact">Solicitar Consulta Gratuita</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <Link href="/about">Conoce Más Sobre Nosotros</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
