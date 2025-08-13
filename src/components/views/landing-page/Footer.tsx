import Link from "next/link";
import { FacebookIcon, TwitterIcon, InstagramIcon, Globe2 } from "lucide-react";
import { ShineBorder } from "@/components/magicui/shine-border";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 to-secondary" />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe2 className="h-7 w-7 text-primary" aria-hidden="true" />
              <span className="text-xl font-bold text-primary">
                GABYTOPTRAVEL
              </span>
            </div>
            <p className="text-sm text-foreground/80">
              Viajes premium, atención personalizada y logística sin estrés.
            </p>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/destinations"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Destinos
                </Link>
              </li>
              <li>
                <Link
                  href="/packages"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Paquetes
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Eventos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <ShineBorder className="rounded-md p-2" borderWidth={1}>
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <FacebookIcon size={20} />
                </a>
              </ShineBorder>
              <ShineBorder className="rounded-md p-2" borderWidth={1}>
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <TwitterIcon size={20} />
                </a>
              </ShineBorder>
              <ShineBorder className="rounded-md p-2" borderWidth={1}>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <InstagramIcon size={20} />
                </a>
              </ShineBorder>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/60 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GABYTOPTRAVEL. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
