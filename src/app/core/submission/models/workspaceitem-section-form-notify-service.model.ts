import {NotifyServiceObject} from './notify-service-submission.model'
import { LdnService } from '../../../admin/admin-ldn-services/ldn-services-model/ldn-services.model';
/**
 * An interface to represent the submission's item ldn-services condition.
 */
export interface WorkspaceitemSectionNotifyServiceRequestItemDissemination extends NotifyServiceObject {
  /**
   * The ldn-review service
   */
  reviewService: LdnService;

  /**
   * The ldn-endorse service
   */
  endorseService: LdnService;

  /**
   * The ldn-ingest service
   */
  ingestService: LdnService;
}
