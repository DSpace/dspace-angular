export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}
export enum SortBy {
  'Last updated',
  'Date submitted',
  'Date issued',
  'Title'
}

export class SortOptions {
  constructor(public field: string, public direction: SortDirection) {

  }
}
