import { autoserialize } from 'cerialize';

export class SearchResultSorting {

  @autoserialize
    by: string;

  @autoserialize
    order: string;

}
