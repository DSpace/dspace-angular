import { autoserialize } from 'cerialize';

export class SubmitDataResponseDefinitionObject {

  @autoserialize
  public name: string;

  @autoserialize
  public type: string;

}
