export interface Service {
  id: string;
  professionalId: string;
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
