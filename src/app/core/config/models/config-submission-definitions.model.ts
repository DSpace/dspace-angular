import { ConfigObject } from './config.model';
import { SubmissionSectionModel } from './config-submission-section.model';
import { PaginatedList } from '../../data/paginated-list';

export class SubmissionDefinitionsModel extends ConfigObject {

  /**
   * A boolean representing if this submission definition is the default or not
   */
  isDefault: boolean;

  /**
   * A list of SubmissionSectionModel that are present in this submission definition
   */
  sections: PaginatedList<SubmissionSectionModel>;

}
