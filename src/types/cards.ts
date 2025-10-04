export interface Cardset {
  idea: string;
  description: string;
}

export interface Card {
  front: {
    term: string;
  };
  back: {
    definition: string;
  };
  src: string;
  alt: string;
  options: string[];
  hint: string;
  theme: string;
  category: string;
}
