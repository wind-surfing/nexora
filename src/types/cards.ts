export interface Cardset {
  idea: string;
  description: string;
}

export interface Card {
  front: {
    term: string;
    src: string;
    alt?: string;
  };
  back: {
    definition: string;
    src: string;
    alt?: string;
  };
  hint: string;
  theme: string;
  category: string;
}