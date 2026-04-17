import { autoserialize } from 'cerialize';

export class AppliedFilter {

  @autoserialize
    filter: string;

  @autoserialize
    operator: string;

  @autoserialize
    value: string;

  @autoserialize
    label: string;

}
