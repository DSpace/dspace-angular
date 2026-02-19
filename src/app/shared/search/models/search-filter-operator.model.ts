import { autoserialize } from 'cerialize';

export class SearchFilterOperator {
  @autoserialize
  operator: string;
}
