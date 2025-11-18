import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Award,
} from "lucide-react";
import { ShineBorder } from "@/components/magicui/shine-border";
import Image from "next/image";
import { TextLogo } from "@/components/ui/text-logo";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gray-700 text-white">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Image
                src="/logos/iso_white.svg"
                alt="GabyTop Travel Logo"
                width={40}
                height={40}
              />
              <TextLogo variant="white" size="lg" />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Agencia de viajes líder en Bolivia, especializada en crear
              experiencias de viaje personalizadas e inolvidables. Más de 20
              años de experiencia.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Award className="h-4 w-4" />
              <span>Certificada por el Ministerio de Turismo</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">
              Nuestros Servicios
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/destinations"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Destinos Top
                </Link>
              </li>
              <li>
                <Link
                  href="/weddings"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Bodas de Destino
                </Link>
              </li>
              <li>
                <Link
                  href="/quinceanera"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Quinceañeras
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Conciertos & Eventos
                </Link>
              </li>
              <li>
                <Link
                  href="/fixed-departures"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Salidas Fijas
                </Link>
              </li>
              <li>
                <Link
                  href="/packages"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Paquetes Vacacionales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-gray-300 text-sm font-medium">
                    +591 756 514 51
                  </div>
                  <div className="text-gray-400 text-xs">WhatsApp 24/7</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-gray-300 text-sm font-medium">
                    Elias@gabytoptravel.com
                  </div>
                  <div className="text-gray-400 text-xs">Atención general</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-gray-300 text-sm font-medium">
                    Lun - Vie: 8:30 - 18:30
                  </div>
                  <div className="text-gray-400 text-xs">Sáb: 9:00 - 12:30</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="text-sm font-semibold text-gray-300 mb-3">
                Nuestras Oficinas
              </h5>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <a
                      href="https://maps.app.goo.gl/3CyKDKuUwj7GJ8Yf7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white text-xs font-medium transition-colors"
                    >
                      Santa Cruz - Equipetrol Norte
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <a
                      href="https://maps.app.goo.gl/R88tDzsuBTFgR4M47"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white text-xs font-medium transition-colors"
                    >
                      Santa Cruz - 3er Anillo
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <a
                      href="https://maps.app.goo.gl/JfN5CKSx5rXgLCsm7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white text-xs font-medium transition-colors"
                    >
                      Cochabamba - Centro
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <a
                      href="https://maps.app.goo.gl/BXcNshfLnZyXrkr3A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white text-xs font-medium transition-colors"
                    >
                      La Paz - Calacoto
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <a
                      href="https://maps.app.goo.gl/hAZKKtJAbr8nRC2e6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white text-xs font-medium transition-colors"
                    >
                      Oruro - Centro
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Síguenos</h4>
            <div className="flex gap-4 mb-6">
              <a
                href="https://www.facebook.com/gabytoptravel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <FacebookIcon size={24} />
              </a>
              <a
                href="https://www.instagram.com/gaby_top_travel/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <InstagramIcon size={24} />
              </a>
              <a
                href="https://wa.me/59175651451"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <MessageCircle size={24} />
              </a>
            </div>

            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-gray-300 mb-2">
                Enlaces Legales
              </h5>
              <div className="space-y-2">
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors text-xs block"
                >
                  Términos y Condiciones
                </Link>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors text-xs block"
                >
                  Política de Privacidad
                </Link>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors text-xs block"
                >
                  Sobre Nosotros
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} GABYTOPTRAVEL. Todos los
                derechos reservados.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Agencia de viajes registrada en Bolivia | Licencia de operación
                turística
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Desarrollado por</span>
              <a
                href="https://boring.lat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500"
              >
                Boring Ventures
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
