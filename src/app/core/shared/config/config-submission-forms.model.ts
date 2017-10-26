import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { ConfigObject } from './config.model';

@inheritSerialization(ConfigObject)
export class SubmissionFormsModel extends ConfigObject {

  @autoserialize
  fields: any[];

}
