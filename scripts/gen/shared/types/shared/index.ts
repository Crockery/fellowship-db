export interface FSTransObj {
  Namespace: string;
  Key: string;
  SourceString: string;
}

export interface FSBlueprint extends Record<string, any> {
  Type: string;
  Name: string;
  Class: string;
}

export interface FSTagNameObj {
  TagName: string;
}

export interface FSObjectDesc {
  ObjectName: string;
  ObjectPath: string;
}

export interface Translateable {
  key: string;
  default: string;
}
