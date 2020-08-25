import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { SECTION } from './section.resource-type';
import { autoserialize, deserialize } from 'cerialize';
import { HALLink } from '../../shared/hal-link.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';

/**
 * Describes a type of Section.
 */
@typedObject
export class Section extends CacheableObject {
  static type = SECTION;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this Section.
   */
  @autoserialize
  id: string;

  @autoserialize
  componentRows: SectionComponent[][];

  /**
   * The {@link HALLink}s for this Tab
   */
  @deserialize
  _links: {
      self: HALLink,
  };

}

export interface SectionComponent {
    componentType: string;
    style: string;
}

export interface BrowseSection extends SectionComponent {
    browseNames: string[];
    componentType: 'browse';
}

export interface TopSection extends SectionComponent {
    discoveryConfigurationName: string;
    sortField: string;
    order: string;
    componentType: 'top';
}

export interface SearchSection extends SectionComponent {
    discoveryConfigurationName: string;
    componentType: 'search';
}

export interface FacetSection extends SectionComponent {
    discoveryConfigurationName: string;
    componentType: 'facet';
}
