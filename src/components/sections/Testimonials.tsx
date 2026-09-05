import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Camila S.",
    text: "Simplesmente apaixonada pelo resultado! A Rosely é super cuidadosa e caprichosa em cada detalhe. Minhas unhas nunca duraram tanto.",
  },
  {
    name: "Beatriz A.",
    text: "Atendimento maravilhoso, ambiente aconchegante e um trabalho impecável. Já virei cliente fiel do studio!",
  },
  {
    name: "Juliana M.",
    text: "O alongamento ficou perfeito, super natural. Recomendo de olhos fechados, o agendamento online facilitou muito minha vida.",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-20 md:py-28 bg-rose-800 text-blush-100 overflow-hidden">
      <Quote className="absolute -top-6 left-8 h-32 w-32 text-rose-700/50" strokeWidth={1} />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold-300">
            Depoimentos
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-cream-50">O que dizem as clientes</h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl bg-rose-900/40 border border-rose-700/60 p-6 backdrop-blur-sm">
              <div className="flex gap-1 text-gold-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-blush-100/90">“{t.text}”</p>
              <p className="mt-4 font-display text-base text-gold-300">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
