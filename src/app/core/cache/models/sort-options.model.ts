export enum SortDirection {
  Ascending,
  Descending
}

export class SortOptions {
  field: string = "id";
  direction: SortDirection = SortDirection.Ascending
}
