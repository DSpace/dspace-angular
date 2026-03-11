import { Item } from '../../../shared/item.model';
import { QualityAssuranceEventObject } from './quality-assurance-event.model';

/**
 * The possible types of import for the external entry
 */
export enum ImportType {
  None = 'None',
  LocalEntity = 'LocalEntity',
  LocalAuthority = 'LocalAuthority',
  NewEntity = 'NewEntity',
  NewAuthority = 'NewAuthority'
}

/**
 * The data type passed from the parent page
 */
export interface QualityAssuranceEventData {
  /**
   * The Quality Assurance event
   */
  event: QualityAssuranceEventObject;
  /**
   * The Quality Assurance event Id (uuid)
   */
  id: string;
  /**
   * The publication title
   */
  title: string;
  /**
   * Contains the boolean that indicates if a project is present
   */
  hasProject: boolean;
  /**
   * The project title, if present
   */
  projectTitle: string;
  /**
   * The project id (uuid), if present
   */
  projectId: string;
  /**
   * The project handle, if present
   */
  handle: string;
  /**
   * The reject/discard reason
   */
  reason: string;
  /**
   * Contains the boolean that indicates if there is a running operation (REST call)
   */
  isRunning: boolean;
  /**
   * The related publication DSpace item
   */
  target?: Item;
}
