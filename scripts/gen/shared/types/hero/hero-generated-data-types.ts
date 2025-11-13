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

export interface HeroTalentData {
  id: string;
  name: Translateable;
  unlocked_at: number;
  row: number;
  // TODO: Get column
  cost: number;
  description: Translateable;
  image: string;
}

export interface Hero extends HeroData, HeroMetaData {
  talents: HeroTalentData[];
}
