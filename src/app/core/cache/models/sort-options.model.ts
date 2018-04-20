export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class SortOptions {
  constructor(public field: string = 'dc.title', public direction: SortDirection = SortDirection.ASC) {

  }
}
