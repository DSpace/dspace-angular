import { autoserialize } from 'cerialize';

export class Bibliography {
  @autoserialize
  style: string;

  @autoserialize
  value: string;
}
