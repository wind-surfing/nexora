export interface Cardset {
  idea: string;
  description: string;
}

export interface Card {
  term: string;
  definition: string;
  src: string;
  alt: string;
  options: [string, string, string];
  hint: string;
  theme: string;
  category: string;
}

export interface CompoundCard {
  idea: string;
  description: string;
  cards: Card[];
}
