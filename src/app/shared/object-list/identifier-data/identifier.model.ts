import {autoserialize} from 'cerialize';

export class Identifier {
  @autoserialize
  value: string;
  @autoserialize
  identifierType: string;
  @autoserialize
  identifierStatus: string;
  @autoserialize
  type: string;
}
