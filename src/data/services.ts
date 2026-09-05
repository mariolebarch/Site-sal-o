export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  active: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: "hand" | "foot" | "sparkle" | "combo" | "extra";
}

export const serviceCategories: ServiceCategory[] = [
  { id: "maos", name: "Mãos", icon: "hand" },
  { id: "pes", name: "Pés", icon: "foot" },
  { id: "nailart", name: "Nail Art", icon: "sparkle" },
  { id: "combos", name: "Combos", icon: "combo" },
  { id: "extras", name: "Extras", icon: "extra" },
];

export const defaultServices: Service[] = [
  {
    id: "manicure-tradicional",
    categoryId: "maos",
    name: "Manicure Tradicional",
    description: "Cutilagem, lixamento e esmaltação tradicional.",
    durationMin: 45,
    price: 35,
    active: true,
  },
  {
    id: "esmaltacao-gel-maos",
    categoryId: "maos",
    name: "Esmaltação em Gel",
    description: "Esmaltação em gel de alta duração com acabamento espelhado.",
    durationMin: 60,
    price: 50,
    active: true,
  },
  {
    id: "alongamento-fibra",
    categoryId: "maos",
    name: "Alongamento em Fibra de Vidro",
    description: "Alongamento leve e resistente, acabamento natural.",
    durationMin: 120,
    price: 120,
    active: true,
  },
  {
    id: "alongamento-acrigel",
    categoryId: "maos",
    name: "Alongamento em Acrigel",
    description: "Alongamento em acrigel com alta durabilidade.",
    durationMin: 150,
    price: 150,
    active: true,
  },
  {
    id: "manutencao-alongamento",
    categoryId: "maos",
    name: "Manutenção de Alongamento",
    description: "Ajuste e reforço do alongamento já existente.",
    durationMin: 90,
    price: 80,
    active: true,
  },
  {
    id: "banho-de-gel",
    categoryId: "maos",
    name: "Banho de Gel",
    description: "Fortalecimento e brilho intenso para unhas naturais.",
    durationMin: 60,
    price: 55,
    active: true,
  },
  {
    id: "pedicure-tradicional",
    categoryId: "pes",
    name: "Pedicure Tradicional",
    description: "Cutilagem, lixamento e esmaltação tradicional dos pés.",
    durationMin: 50,
    price: 40,
    active: true,
  },
  {
    id: "spa-dos-pes",
    categoryId: "pes",
    name: "Spa dos Pés",
    description: "Esfoliação, hidratação profunda e massagem relaxante.",
    durationMin: 70,
    price: 65,
    active: true,
  },
  {
    id: "esmaltacao-gel-pes",
    categoryId: "pes",
    name: "Esmaltação em Gel — Pés",
    description: "Esmaltação em gel de alta duração para os pés.",
    durationMin: 45,
    price: 45,
    active: true,
  },
  {
    id: "nail-art-simples",
    categoryId: "nailart",
    name: "Nail Art Simples",
    description: "Adesivos, francesinha ou desenhos delicados (até 2 unhas).",
    durationMin: 20,
    price: 15,
    active: true,
  },
  {
    id: "nail-art-elaborada",
    categoryId: "nailart",
    name: "Nail Art Elaborada",
    description: "Desenhos autorais, pedrarias e efeitos 3D.",
    durationMin: 45,
    price: 35,
    active: true,
  },
  {
    id: "encapsulado",
    categoryId: "nailart",
    name: "Encapsulado / Baby Boomer",
    description: "Técnicas especiais de degradê e encapsulamento.",
    durationMin: 40,
    price: 30,
    active: true,
  },
  {
    id: "combo-maos-pes",
    categoryId: "combos",
    name: "Manicure + Pedicure",
    description: "Combo completo para mãos e pés no mesmo horário.",
    durationMin: 90,
    price: 70,
    active: true,
  },
  {
    id: "dia-de-noiva",
    categoryId: "combos",
    name: "Dia de Noiva",
    description: "Manicure + Pedicure + Nail Art especial para o grande dia.",
    durationMin: 180,
    price: 180,
    active: true,
  },
  {
    id: "remocao-alongamento",
    categoryId: "extras",
    name: "Remoção de Alongamento",
    description: "Remoção segura de alongamento anterior.",
    durationMin: 30,
    price: 25,
    active: true,
  },
  {
    id: "blindagem",
    categoryId: "extras",
    name: "Blindagem de Unhas",
    description: "Fortalecimento para unhas fracas e quebradiças.",
    durationMin: 40,
    price: 35,
    active: true,
  },
];
