import { FellowshipBlueprint, FellowshipTransObj } from "../shared";

export interface HeroMetaDataRaw extends FellowshipBlueprint {
  Properties: {
    ClassColor: {
      B: number;
      G: number;
      R: number;
      A: number;
      Hex: string;
    };
    HeroPortraitImage: {
      ObjectName: string;
      ObjectPath: string;
    };
    HeroTitle: FellowshipTransObj;
    OverallDifficulty: number;
    CharacterRole: string;
    PrimaryAttribute: string;
    HeroName: FellowshipTransObj;
    HeroDescription: FellowshipTransObj;
    Biography: FellowshipTransObj;
  };
}

export interface HeroDataRaw extends FellowshipBlueprint {
  Properties: {
    HeroID: {
      TagName: string;
    };
  };
}
