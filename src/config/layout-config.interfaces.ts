import { AdvancedAttachmentRenderingConfig } from './advanced-attachment-rendering.config';
import { Config } from './config.interface';

/**
 * Configuration for styling entity icons with Font Awesome icons and CSS classes.
 *
 * Defines the visual appearance (icon and CSS style) for entity references.
 * Used by {@link EntityIconDirective} to render icons next to entity names based on their type and style.
 * @see AuthorityRefConfig
 * @see EntityIconDirective
 */
export interface AuthorityRefEntityStyleConfig extends Config {
  /**
   * Font Awesome icon classes to display (e.g., 'fa fa-user', 'fas fa-project-diagram').
   */
  icon: string;

  /**
   * CSS classes for styling the icon (e.g., 'text-info', 'text-success').
   */
  style: string;
}

/**
 * Configuration for entity reference display based on entity type.
 *
 * Maps entity types (e.g., PERSON, ORGUNIT, PROJECT) to their visual styles.
 * Each entity type can have multiple style variants, with a required 'default' fallback.
 * Used by {@link EntityIconDirective} to determine which icon and style to display for authority-controlled entities.
 * @see AuthorityRefEntityStyleConfig
 * @see LayoutConfig
 * @see EntityIconDirective
 */
export interface AuthorityRefConfig extends Config {
  /**
   * The entity type identifier (e.g., 'PERSON', 'ORGUNIT', 'PROJECT', 'DEFAULT').
   */
  entityType: string;

  /**
   * Map of style names to their configurations.
   * Must include a 'default' style as fallback.
   */
  entityStyle: {
    /**
     * Default style configuration used as fallback when specific style is not found.
     */
    default: AuthorityRefEntityStyleConfig;
    /**
     * Additional named style variants for the entity type.
     */
    [entity: string]: AuthorityRefEntityStyleConfig;
  };
}

export interface UrnConfig extends Config {
  name: string;
  baseUrl: string;
  shouldKeepWhiteSpaces?: boolean;
}

export interface DynamicLayoutTypeConfig {
  orientation: string;
}

export interface DynamicLayoutMetadataBoxConfig extends Config {
  defaultMetadataLabelColStyle: string;
  defaultMetadataValueColStyle: string;
}

export interface DynamicLayoutCollectionsBoxConfig extends Config {
  defaultCollectionsLabelColStyle: string;
  defaultCollectionsValueColStyle: string;
  isInline: boolean;
  defaultCollectionsRowStyle?: string;
}

export interface DynamicItemPageConfig extends Config {
  [entity: string]: DynamicLayoutTypeConfig;
  default: DynamicLayoutTypeConfig;
}

/**
 * Top-level layout configuration for UI visual customization.
 *
 * Provides configuration for customizing the visual appearance and layout of entities,
 * including authority reference styling, attachment rendering, and dynamic item page layouts.
 * @see AuthorityRefConfig
 * @see AppConfig
 */
export interface LayoutConfig extends Config {
  /**
   * Array of authority reference configurations for different entity types.
   * Each entry defines how entities of a specific type should be visually represented with icons and styles.
   */
  authorityRef: AuthorityRefConfig[];

  /**
   * If true the download link in item page will be rendered as an advanced attachment.
   */
  showDownloadLinkAsAttachment: boolean;

  /**
   * Configuration for advanced attachment rendering features.
   * Controls pagination and metadata display for bitstream attachments.
   */
  advancedAttachmentRendering: AdvancedAttachmentRenderingConfig;

  /**
   * Array of URN (Uniform Resource Name) configurations mapping identifiers to their base URLs.
   * Used for resolving identifiers like DOI, Handle, Scopus, etc. to their external URLs.
   */
  urn: UrnConfig[];

  /**
   * Item page layout configuration for different entity types.
   * Defines the orientation (horizontal/vertical) of item page layouts based on entity type.
   */
  itemPage: DynamicItemPageConfig;

  /**
   * Metadata box rendering configuration.
   * Defines default CSS column styles for metadata labels and values.
   */
  metadataBox: DynamicLayoutMetadataBoxConfig;

  /**
   * Collections box rendering configuration.
   * Defines default CSS column styles for collection labels and values, and inline display settings.
   */
  collectionsBox: DynamicLayoutCollectionsBoxConfig;
}
