import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { ConfigObject } from './config.model';

@inheritSerialization(ConfigObject)
export class SubmissionSectionModel extends ConfigObject {

  @autoserialize
  header: string;

  @autoserialize
  mandatory: boolean;

  @autoserialize
  sectionType: string;

}
