import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { serviceCategories } from "../../data/services";
import { IconHand, IconFoot, IconSparkleGlyph, IconCombo, IconExtra } from "../decor/Icons";

const categoryIcons = {
  hand: IconHand,
  foot: IconFoot,
  sparkle: IconSparkleGlyph,
  combo: IconCombo,
  extra: IconExtra,
};

export function Services() {
  const services = useAppStore((s) => s.services);

  return (
    <section id="servicos" className="relative py-20 md:py-28 bg-blush-50">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-rose-600">
            Procedimentos
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-rose-900">Nossos serviços</h2>
          <p className="mt-4 text-ink-700">
            Escolha o procedimento ideal para você. Cada serviço tem duração própria — o
            agendamento mostra automaticamente os horários disponíveis conforme o tempo necessário.
          </p>
        </div>

        <div className="mt-14 space-y-14">
          {serviceCategories.map((cat) => {
            const items = services.filter((s) => s.categoryId === cat.id && s.active);
            if (items.length === 0) return null;
            const Icon = categoryIcons[cat.icon];
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-full bg-white shadow-soft flex items-center justify-center text-rose-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-2xl text-rose-800">{cat.name}</h3>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className="group rounded-2xl bg-white border border-blush-200 p-5 hover:border-rose-300 hover:shadow-soft transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-semibold text-ink-900 leading-snug">{s.name}</h4>
                        <span className="shrink-0 font-display text-lg text-rose-600">
                          R$ {s.price.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-ink-500 leading-relaxed">{s.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                          <Clock className="h-3.5 w-3.5" /> {s.durationMin} min
                        </span>
                        <Link
                          to={`/agendar?service=${s.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Agendar <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
