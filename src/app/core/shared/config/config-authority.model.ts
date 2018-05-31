import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { ConfigObject } from './config.model';
import { SubmissionSectionModel } from './config-submission-section.model';
import { isNotEmpty } from '../../../shared/empty.util';

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

  hasValue(): boolean {
    return isNotEmpty(this.value);
  }
}
