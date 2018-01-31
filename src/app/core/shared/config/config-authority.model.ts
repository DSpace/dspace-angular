import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { ConfigObject } from './config.model';
import { SubmissionSectionModel } from './config-submission-section.model';

@inheritSerialization(ConfigObject)
export class ConfigAuthorityModel extends ConfigObject {

  @autoserialize
  id: string;

  @autoserialize
  display: string;

  @autoserialize
  value: string;

  @autoserialize
  otherInformation: any;

  @autoserialize
  language: string;

}
