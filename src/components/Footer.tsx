import { MapPin, Phone, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { business, weekdayNames, type Weekday } from "../data/business";
import { useAppStore } from "../store/useAppStore";
import { Monogram, IconInstagram } from "./decor/Icons";

export function Footer() {
  const businessHours = useAppStore((s) => s.businessHours);

  return (
    <footer className="bg-rose-900 text-blush-100">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Monogram variant="light" className="h-9 w-9" />
            <span className="font-display text-xl text-cream-50">Studio Rosely Lebarch</span>
          </div>
          <p className="text-sm text-blush-200/80 leading-relaxed max-w-xs">{business.bio}</p>
          <a
            href={business.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-gold-300 hover:text-gold-200 transition-colors"
          >
            <IconInstagram className="h-4 w-4" /> {business.instagramHandle}
          </a>
        </div>

        <div>
          <h4 className="font-display text-base text-cream-50 mb-4">Contato</h4>
          <ul className="space-y-3 text-sm text-blush-200/85">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold-300" />
              {business.address.full}
            </li>
            <li className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5 shrink-0 text-gold-300" />
              <a href={business.whatsappLink} target="_blank" rel="noreferrer" className="hover:text-gold-200">
                Fale no WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base text-cream-50 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold-300" /> Horário de funcionamento
          </h4>
          <ul className="space-y-1.5 text-sm text-blush-200/85">
            {([1, 2, 3, 4, 5, 6, 0] as Weekday[]).map((day) => (
              <li key={day} className="flex justify-between gap-4">
                <span>{weekdayNames[day]}</span>
                <span>{businessHours[day].open ? `${businessHours[day].start} – ${businessHours[day].end}` : "Fechado"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-rose-800/60">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blush-200/60">
          <span>© {new Date().getFullYear()} Studio Rosely Lebarch Nails Design. Todos os direitos reservados.</span>
          <Link to="/login" className="hover:text-gold-300 transition-colors">
            Área da profissional
          </Link>
        </div>
      </div>
    </footer>
  );
}
