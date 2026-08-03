import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { SECTION } from './section.resource-type';

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

  @autoserialize
    nestedSections: Section[];

  /**
   * The {@link HALLink}s for this section
   */
  @deserialize
    _links: {
    self: HALLink,
  };

}

/**
 * Base interface for all section component configurations returned by the REST API.
 */
export interface SectionComponent {
  /** The type discriminator identifying which component to render. */
  componentType: string;
  /** CSS classes applied to the section container (e.g., Bootstrap grid classes). */
  style: string;
}

/**
 * Configuration for a browse section that displays links to browse indices.
 */
export interface BrowseSection extends SectionComponent {
  /** List of browse index names to render as navigation links. */
  browseNames: string[];
  componentType: 'browse';
}

/**
 * Configuration for a top section that displays the most recent/popular items
 * from a discovery configuration.
 */
export interface TopSection extends SectionComponent {
  /** Name of the discovery configuration to query. */
  discoveryConfigurationName: string;
  /** Metadata field to sort results by. */
  sortField: string;
  /** Sort direction ('ASC' or 'DESC'). */
  order: string;
  /** i18n key for the section title. */
  titleKey: string;
  componentType: 'top';
  /** Maximum number of items to display. */
  numberOfItems: number;
  /** Whether to show item thumbnails. */
  showThumbnails: boolean;
  /** Template type to use for rendering the items. */
  template: TopSectionTemplateType;
}

/**
 * Configuration for an advanced search section with multiple query statements and filter fields.
 */
export interface SearchSection extends SectionComponent {
  /** Name of the discovery configuration providing available filters. */
  discoveryConfigurationName: string;
  componentType: 'search';
  /** Type of search interface to render. */
  searchType: string;
  /** Number of query statement rows to display initially. */
  initialStatements: number;
  /** Whether to display the section title. */
  displayTitle: boolean;
}

/**
 * Configuration for a section displaying search facets from a discovery configuration.
 */
export interface FacetSection extends SectionComponent {
  /** Name of the discovery configuration to fetch facet values from. */
  discoveryConfigurationName: string;
  componentType: 'facet';
  /** Number of facet boxes to display per row in the grid. */
  facetsPerRow: number;
}

/**
 * Configuration for a text content section that renders static or metadata-based content.
 */
export interface TextRowSection extends SectionComponent {
  /** The content string (can be a metadata key or raw content depending on contentType). */
  content: string;
  /** The type of content: e.g., 'text-metadata' for metadata lookups or 'text-raw' for static content. */
  contentType: string;
  componentType: 'text-row';
}

/**
 * Configuration for a table-like section showing top items with multiple metadata columns.
 */
export interface MultiColumnTopSection extends SectionComponent {
  /** Name of the discovery configuration to query. */
  discoveryConfigurationName: string;
  /** Metadata field to sort results by. */
  sortField: string;
  /** Sort direction ('ASC' or 'DESC'). */
  order: string;
  /** i18n key for the section title. */
  titleKey: string;
  /** List of column definitions specifying which metadata fields to display. */
  columnList: TopSectionColumn[];
  componentType: 'multi-column-top';
}

/**
 * Column configuration for {@link MultiColumnTopSection} defining which metadata to display.
 */
export interface TopSectionColumn {
  /** CSS classes for column width styling. */
  style: string;
  /** Metadata field to extract the column value from. */
  metadataField: string;
  /** i18n key for the column header. */
  titleKey: string;
}

/**
 * Represents the type of template to use for the section
 */
export enum TopSectionTemplateType {
  DEFAULT = 'default', // CRIS default template
}
