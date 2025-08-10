import Link from "next/link";
import { FacebookIcon, TwitterIcon, InstagramIcon, Globe2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Globe2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">
                GABYTOPTRAVEL
              </span>
            </div>
            <p className="text-muted-foreground">
              Viajes premium, atención personalizada y logística sin estrés.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
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
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
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
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FacebookIcon size={24} />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <TwitterIcon size={24} />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <InstagramIcon size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} GABYTOPTRAVEL. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
