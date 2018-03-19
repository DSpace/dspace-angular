import { autoserialize, autoserializeAs } from 'cerialize';

export class SearchAppliedFilter {
  @autoserialize
  filter: string;

  @autoserialize
  label: string;

  @autoserialize
  operator: any;

  @autoserialize
  value: any;

  /**
   * Value of this applied filter
   * @returns Parameter value
   */
  get appliedValue(): string {
    return this.value + ',' + this.operator;
  }
}
