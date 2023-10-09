import {NotifyServiceObject} from './notify-service-submission.model'
/**
 * An interface to represent the submission's item accesses condition.
 */
export interface WorkspaceitemSectionNotifyServiceRequestItemDissemination extends NotifyServiceObject {
  /**
   * The access condition id
   */
  id: string;

  /**
   * Boolean that indicates whether the current item must be findable via search or browse.
   */
  discoverable: boolean;


}
