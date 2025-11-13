import { FSBlueprint, FSTransObj, FSTagNameObj, FSObjectDesc } from "../shared";

export interface HeroMetaDataRaw extends FSBlueprint {
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
    HeroTitle: FSTransObj;
    OverallDifficulty: number;
    CharacterRole: string;
    PrimaryAttribute: string;
    HeroName: FSTransObj;
    HeroDescription: FSTransObj;
    Biography: FSTransObj;
  };
}

export interface HeroDataRaw extends FSBlueprint {
  Properties: {
    HeroID: FSTagNameObj;
  };
}

export interface HeroTalentDataRaw extends FSBlueprint {
  Type: "CRTalentData";
  Properties: {
    Talents: {
      TalentID: FSTagNameObj;
      Name: FSTransObj;
      UnlockLevel: number;
      TalentRow: number;
      TalentPointCost: number;
      DisabledInGame: boolean;
      DetailedDescription: FSTransObj;
      UIIconTexture: {
        ResourceObject: FSObjectDesc;
      };
    }[];
  };
}
