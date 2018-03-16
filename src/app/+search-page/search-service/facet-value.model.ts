import { autoserialize } from 'cerialize';
import { FilterValueType } from './filter-value-type.model';

export class FacetValue {

  @autoserialize
  label: string;

  @autoserialize
  filterValue: string;

  @autoserialize
  count: number;

  @autoserialize
  authorityKey: string;

  @autoserialize
  filterType: FilterValueType;

  @autoserialize
  sortValue: string;

  @autoserialize
  search: string;

  get value() {
    if (this.filterType === FilterValueType.Authority) {
      return this.filterValue + ',' + this.filterType;
    } else {
      return this.filterValue;
    }
  }
}
