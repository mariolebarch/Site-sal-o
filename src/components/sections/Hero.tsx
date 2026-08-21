import { Link } from "react-router-dom";
import { Sparkles, MapPin, Star } from "lucide-react";
import { PhotoPlaceholder } from "../PhotoPlaceholder";
import { FlowerDecor, PolishBottleDecor } from "../decor/Icons";
import { business } from "../../data/business";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blush-100 via-cream-100 to-cream-50 pt-28 pb-20 md:pt-36 md:pb-28">
      <FlowerDecor className="absolute -top-6 -left-6 h-32 w-32 text-blush-300/60 animate-float-slow" />
      <PolishBottleDecor className="absolute top-24 right-6 h-20 w-20 text-gold-400/40 animate-float-slower hidden sm:block" />
      <FlowerDecor className="absolute bottom-0 right-10 h-24 w-24 text-rose-300/40 animate-float-slower" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-blush-300 px-4 py-1.5 text-xs font-semibold tracking-wide text-rose-700 uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Nail Designer em {business.address.neighborhood}
          </span>

          <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.08] text-rose-900 text-balance">
            Unhas impecáveis, com a assinatura de <span className="text-rose-600">Rosely Lebarch</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-ink-700 max-w-lg leading-relaxed">
            {business.bio}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/agendar"
              className="rounded-full bg-rose-600 hover:bg-rose-700 text-cream-50 font-semibold px-7 py-3.5 text-center shadow-soft transition-colors"
            >
              Agendar meu horário
            </Link>
            <a
              href="#servicos"
              className="rounded-full border border-rose-300 hover:border-rose-500 text-rose-700 font-semibold px-7 py-3.5 text-center transition-colors"
            >
              Ver procedimentos
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <div className="flex items-center gap-1 text-gold-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-ink-500">Avaliação das clientes no Instagram</span>
          </div>

          <a
            href={business.mapsLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center gap-2 text-sm text-ink-500 hover:text-rose-600 transition-colors w-fit"
          >
            <MapPin className="h-4 w-4" /> {business.address.full}
          </a>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-rose-300/40 via-gold-300/30 to-blush-200/40 blur-2xl" />
          <PhotoPlaceholder
            src="/images/rosely-perfil.jpg"
            alt="Rosely Lebarch, nail designer"
            label="Foto de perfil da Rosely (retrato profissional)"
            className="relative w-full aspect-[4/5] rounded-[2rem] shadow-soft border-4 border-white"
          />
          <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-soft px-5 py-4 border border-blush-200 hidden sm:block">
            <p className="font-display text-2xl text-rose-700 leading-none">+500</p>
            <p className="text-xs text-ink-500 mt-1">clientes atendidas</p>
          </div>
        </div>
      </div>
    </section>
  );
}
