export enum SortDirection {
  Ascending,
  Descending
}

export class SortOptions {

  constructor(public field: string = 'name', public direction: SortDirection = SortDirection.Ascending) {

  }
}
