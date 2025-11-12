export interface FellowshipTransObj {
  Namespace: string;
  Key: string;
  SourceString: string;
  LocalizedString: string;
}

export interface FellowshipBlueprint extends Record<string, any> {
  Type: string;
  Name: string;
  Class: string;
}

export interface Translateable {
  key: string;
  default: string;
}
