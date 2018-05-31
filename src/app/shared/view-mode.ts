export enum SetViewMode {
  List = 'list',
  Grid = 'grid'
}

export enum ElementViewMode {
  Full,
  SetElement
}

export type ViewMode = SetViewMode | ElementViewMode;
