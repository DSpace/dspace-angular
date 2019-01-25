import { autoserialize, inheritSerialization } from 'cerialize';
import { NormalizedObject } from '../../cache/models/normalized-object.model';

@inheritSerialization(NormalizedObject)
export abstract class ConfigObject extends  NormalizedObject {

  @autoserialize
  public name: string;

}
