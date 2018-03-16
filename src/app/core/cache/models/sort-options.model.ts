export enum SortDirection {
  Ascending = 'ASC',
  Descending = 'DESC'
}
export enum SortBy {
  'Last updated',
  'Date submitted',
  'Date issued',
  'Title'
}

export class SortOptions {
  constructor(public field: string = 'dc.title', public direction: SortDirection = SortDirection.Ascending) {

  }
}
