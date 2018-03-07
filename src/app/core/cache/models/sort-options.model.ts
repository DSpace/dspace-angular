export enum SortDirection {
  Ascending = 'ASC',
  Descending = 'DESC'
}

export class SortOptions {
  constructor(public field: string = 'dc.title', public direction: SortDirection = SortDirection.Ascending) {

  }
}
