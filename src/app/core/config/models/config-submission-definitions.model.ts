import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { ConfigObject } from './config.model';
import { SubmissionSectionModel } from './config-submission-section.model';
import { PaginatedList } from '../../data/paginated-list';

@inheritSerialization(ConfigObject)
export class SubmissionDefinitionsModel extends ConfigObject {

  @autoserialize
  isDefault: boolean;

  @autoserializeAs(SubmissionSectionModel)
  sections: PaginatedList<SubmissionSectionModel>;

}
