import { autoserialize } from 'cerialize';

export class FacetValue {

  @autoserialize
  label: string;

  @autoserialize
  value: string;

  @autoserialize
  count: number;

  @autoserialize
  search: string;
}
