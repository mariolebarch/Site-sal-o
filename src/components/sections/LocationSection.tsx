import { MapPin, Clock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { business, weekdayNames, type Weekday } from "../../data/business";
import { useAppStore } from "../../store/useAppStore";

export function LocationSection() {
  const businessHours = useAppStore((s) => s.businessHours);

  return (
    <section id="localizacao" className="relative py-20 md:py-28 bg-blush-50">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 grid lg:grid-cols-2 gap-10 items-stretch">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-rose-600">
            Onde estamos
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-rose-900">Venha nos visitar</h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-blush-200 shadow-soft">
              <MapPin className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-ink-900">Endereço</p>
                <p className="text-sm text-ink-500">{business.address.full}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-blush-200 shadow-soft">
              <Clock className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
              <div className="w-full">
                <p className="font-semibold text-ink-900">Horário de funcionamento</p>
                <ul className="text-sm text-ink-500 mt-1 space-y-1">
                  {([1, 2, 3, 4, 5, 6, 0] as Weekday[]).map((day) => (
                    <li key={day} className="flex justify-between">
                      <span>{weekdayNames[day]}</span>
                      <span>
                        {businessHours[day].open
                          ? `${businessHours[day].start} – ${businessHours[day].end}`
                          : "Fechado"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/agendar"
              className="rounded-full bg-rose-600 hover:bg-rose-700 text-cream-50 font-semibold px-6 py-3 text-center transition-colors"
            >
              Agendar horário
            </Link>
            <a
              href={business.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-300 hover:border-rose-500 text-rose-700 font-semibold px-6 py-3 transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
            </a>
          </div>
        </div>

        <div className="min-h-[320px] rounded-2xl overflow-hidden shadow-soft border border-blush-200">
          <iframe
            title="Localização do Studio Rosely Lebarch"
            src={business.mapsEmbedSrc}
            className="w-full h-full min-h-[320px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
