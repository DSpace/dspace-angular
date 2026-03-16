import { IdentifierSubtypesConfig } from '@dspace/config/identifier-subtypes-config.interface';

/**
 * Configuration for metadata displayed in popovers when hovering over authority-controlled metadata links.
 *
 * This interface defines which metadata fields should be displayed in a popover tooltip
 * when users hover over linked metadata values (such as author names, organizations, etc.).
 * Each entity type (Person, OrgUnit, etc.) can have its own set of metadata fields to display.
 * Used by {@link MetadataLinkViewPopoverComponent} to render rich previews of linked entities.
**/

export interface MetadataLinkViewPopoverDataConfig {
  /**
   * The list of entity types to display the metadata for
   */
  entityDataConfig: EntityDataConfig[];

  /**
   * The list of metadata keys to fallback to
   */
  fallbackMetdataList: string[];
  /**
   * Types used to map the layout of the identifier in the popover and the icon displayed next to the metadata value.
   */
  identifierSubtypes: IdentifierSubtypesConfig[];
}


export interface EntityDataConfig {
  /**
   * The metadata entity type
   */
  entityType: string;
  /**
   * The list of metadata keys to display
   */
  metadataList: string[];
  /**
  * The list of title metadata keys to display as title (optional as default is on dc.title)
  **/
  titleMetadataList?: string[];
}
