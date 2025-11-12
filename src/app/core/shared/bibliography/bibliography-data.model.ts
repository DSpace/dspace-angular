import {
  autoserialize,
  deserialize,
} from 'cerialize';
import { typedObject } from 'src/app/core/cache/builders/build-decorators';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { HALLink } from 'src/app/core/shared/hal-link.model';
import { ResourceType } from 'src/app/core/shared/resource-type';
import { excludeFromEquals } from 'src/app/core/utilities/equals.decorators';

import { Bibliography } from './bibliography.model';
import { BIBLIOGRAPHY } from './bibliography.resource-type';

/**
 * Class representing a DSpace Version
 */
@typedObject
export class BibliographyData extends DSpaceObject {
  static type = BIBLIOGRAPHY;

  /**
   * The type for this IdentifierData
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The
   */
  @autoserialize
  bibliographies: Bibliography[];

  /**
   * The {@link HALLink}s for this IdentifierData
   */
  @deserialize
  _links: {
    self: HALLink;
  };

}
