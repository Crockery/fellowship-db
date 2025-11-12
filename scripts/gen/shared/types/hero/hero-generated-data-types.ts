import { Translateable } from "../shared";

export interface HeroMetaData {
  class_color: {
    R: number;
    G: number;
    B: number;
    A: number;
    hex: string;
  };
  name: Translateable;
  title: Translateable;
  description: Translateable;
  biography: Translateable;
  difficulty: number;
}

export interface HeroData {
  id: string;
}

export type Hero = HeroData & HeroMetaData;
