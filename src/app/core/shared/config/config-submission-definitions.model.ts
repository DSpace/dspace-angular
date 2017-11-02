import { autoserialize, inheritSerialization } from 'cerialize';
import { ConfigObject } from './config.model';
import { SubmissionSectionModel } from './config-submission-section.model';
import { RemoteData } from '../../data/remote-data';

@inheritSerialization(ConfigObject)
export class SubmissionDefinitionsModel extends ConfigObject {

  @autoserialize
  isDefault: boolean;

  @autoserialize
  sections: string;

}
