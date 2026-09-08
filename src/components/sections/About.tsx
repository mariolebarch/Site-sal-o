import { Award, Heart, Gem } from "lucide-react";
import { PhotoPlaceholder } from "../PhotoPlaceholder";
import { business } from "../../data/business";

const highlights = [
  {
    icon: Award,
    title: "Técnica e formação",
    text: "Anos de experiência e atualização constante nas melhores técnicas de alongamento e nail art.",
  },
  {
    icon: Gem,
    title: "Materiais de qualidade",
    text: "Produtos selecionados que garantem durabilidade, saúde das unhas e acabamento impecável.",
  },
  {
    icon: Heart,
    title: "Atendimento humanizado",
    text: "Cada horário é pensado para ser um momento de cuidado, conforto e bem-estar para você.",
  },
];

export function About() {
  return (
    <section id="sobre" className="relative py-20 md:py-28 bg-cream-50">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 grid md:grid-cols-2 gap-14 items-center">
        <div className="grid grid-cols-2 gap-4">
          <PhotoPlaceholder
            src="/images/rosely-atelie.jpg"
            alt="Rosely Lebarch trabalhando no studio"
            label="Foto da Rosely no studio"
            className="rounded-2xl aspect-[3/4] shadow-soft mt-8"
          />
          <PhotoPlaceholder
            src="/images/trabalho-destaque-1.jpg"
            alt="Trabalho de nail design"
            label="Foto de unha finalizada"
            className="rounded-2xl aspect-[3/4] shadow-soft"
          />
        </div>

        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-rose-600">
            Sobre a profissional
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-rose-900">
            Olá, eu sou a {business.name}
          </h2>
          <p className="mt-5 text-ink-700 leading-relaxed">
            Apaixonada por transformar unhas em verdadeiras obras de arte, criei o{" "}
            <strong className="text-rose-700">{business.brand}</strong> para oferecer um espaço
            acolhedor onde técnica e delicadeza caminham juntas. Cada procedimento é personalizado
            para valorizar suas mãos e seu estilo, sempre com muito capricho em cada detalhe.
          </p>

          <div className="mt-8 space-y-5">
            {highlights.map((h) => (
              <div key={h.title} className="flex gap-4">
                <div className="shrink-0 h-11 w-11 rounded-full bg-blush-100 flex items-center justify-center text-rose-600">
                  <h.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-900">{h.title}</h3>
                  <p className="text-sm text-ink-500 mt-0.5">{h.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
