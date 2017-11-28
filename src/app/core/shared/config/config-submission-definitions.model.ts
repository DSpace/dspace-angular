import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { ConfigObject } from './config.model';
import { SubmissionSectionModel } from './config-submission-section.model';

@inheritSerialization(ConfigObject)
export class SubmissionDefinitionsModel extends ConfigObject {

  @autoserialize
  isDefault: boolean;

  @autoserializeAs(SubmissionSectionModel)
  sections: SubmissionSectionModel[];

}
