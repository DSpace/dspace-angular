import { autoserialize, inheritSerialization } from 'cerialize';
import { IntegrationModel } from './integration.model';
import { mapsTo } from '../../cache/builders/build-decorators';
import { Authority } from './authority.model';

/**
 * Normalized model class for an Authority
 */
@mapsTo(Authority)
@inheritSerialization(IntegrationModel)
export class NormalizedAuthority extends IntegrationModel {

  /**
   * True if the Authority is scrollable
   */
  @autoserialize
  scrollable: boolean;

  /**
   * True if the Authority is hierarchical
   */
  @autoserialize
  hierarchical: boolean;

  /**
   * The number of levels of a hierarchical Authority that should be pre-loaded
   */
  @autoserialize
  preloadLevel: number;

}
