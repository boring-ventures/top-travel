"use client";

import { Mail, Phone, MapPin, MessageCircle, Globe } from "lucide-react";
import Link from "next/link";

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
    <section className="py-12 w-full bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2">
              Información de <span className="font-light italic">Contacto</span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Emails */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-start">
              <Mail className="text-corporate-blue mr-6 text-4xl flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-6 text-corporate-blue">
                  Email
                </h3>
                <div className="space-y-4">
                  {contactInfo.emails.map((email, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        {email.includes("info")
                          ? "General"
                          : email.includes("reservas")
                            ? "Reservas"
                            : email.includes("bodas")
                              ? "Bodas"
                              : "Quinceañeras"}
                      </div>
                      <a
                        href={`mailto:${email}`}
                        className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-base block"
                      >
                        {email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phones */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-start">
              <Phone className="text-corporate-blue mr-6 text-4xl flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-6 text-corporate-blue">
                  Teléfonos
                </h3>
                <div className="space-y-5">
                  {contactInfo.phones.map((phone, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="text-sm font-bold text-corporate-blue mb-2">
                        {phone.label}
                      </div>
                      <a
                        href={`tel:${phone.number.replace(/\s/g, "")}`}
                        className="text-gray-700 hover:text-green-600 transition-colors font-semibold text-lg block mb-1"
                      >
                        {phone.number}
                      </a>
                      <div className="text-sm text-gray-500 font-medium">
                        {phone.hours}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-start">
              <MapPin className="text-corporate-blue mr-6 text-4xl flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-6 text-corporate-blue">
                  Oficinas
                </h3>
                <div className="space-y-5">
                  {contactInfo.locations.map((location, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="text-sm font-bold text-corporate-blue mb-2">
                        {location.label}
                      </div>
                      <div className="text-gray-700 font-medium mb-1">
                        {location.address}
                      </div>
                      <div className="text-gray-600 font-medium mb-2">
                        {location.city}, {location.country}
                      </div>
                      <div className="text-sm text-gray-500 font-semibold">
                        {location.hours}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              ¿Listo para Planificar tu Viaje?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
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
              <Link
                href="/contact"
                className="bg-corporate-blue text-white px-6 py-3 rounded-full hover:bg-corporate-blue/90 transition-colors duration-300"
              >
                Solicitar Consulta Gratuita
              </Link>
              <Link
                href="/about"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors duration-300"
              >
                Conoce Más Sobre Nosotros
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
