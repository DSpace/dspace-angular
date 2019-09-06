import { IntegrationModel } from './integration.model';
import { ResourceType } from '../../shared/resource-type';

/**
 * Model class for an Authority
 */
export class Authority extends IntegrationModel {
  static type = new ResourceType('authority');

  /**
   * True if the Authority is scrollable
   */
  scrollable: boolean;

  /**
   * True if the Authority is hierarchical
   */
  hierarchical: boolean;

  /**
   * The number of levels of a hierarchical Authority that should be pre-loaded
   */
  preloadLevel: number;

}
