export enum PackageKind {
  Crypt = "Crypt",
  Nominal = "Nominal"
}

export interface DataPackageViewModel {
  id: string;
  kind: PackageKind;
  dataRegion: string;
  count: number;
  originId: string;
}