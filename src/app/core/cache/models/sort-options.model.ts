export enum SortDirection {
  Ascending,
  Descending
}
export enum SortBy {
  'Last updated',
  'Date submitted',
  'Date issued',
  'Title'
}

export class SortOptions {

  constructor(public field: string = 'name', public direction: SortDirection = SortDirection.Ascending) {

  }
}
