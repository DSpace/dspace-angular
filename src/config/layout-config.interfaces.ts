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

/**
 * Configuration for a URN (Uniform Resource Name) resolver entry.
 * Maps an identifier scheme name (e.g., 'doi', 'handle', 'scopus') to a base URL
 * used by {@link ResolverStrategyService} to construct external links.
 */
export interface UrnConfig extends Config {
  /** The URN scheme name (e.g., 'doi', 'handle', 'scopus', 'orcid'). */
  name: string;
  /** The base URL to prepend when resolving this URN type. */
  baseUrl: string;
  /** Whether to preserve whitespace characters in the identifier value. */
  shouldKeepWhiteSpaces?: boolean;
}

/**
 * Configuration specifying the layout orientation for a dynamic item page.
 */
export interface DynamicLayoutTypeConfig {
  /** The page orientation: 'horizontal' (tabs on top) or 'vertical' (tabs in sidebar). */
  orientation: string;
}

/**
 * Configuration for default CSS column styles in metadata box rendering.
 */
export interface DynamicLayoutMetadataBoxConfig extends Config {
  /** Default Bootstrap column class for metadata labels (e.g., 'col-4'). */
  defaultMetadataLabelColStyle: string;
  /** Default Bootstrap column class for metadata values (e.g., 'col-8'). */
  defaultMetadataValueColStyle: string;
}

/**
 * Configuration for default CSS column styles in collections box rendering.
 */
export interface DynamicLayoutCollectionsBoxConfig extends Config {
  /** Default Bootstrap column class for collection labels. */
  defaultCollectionsLabelColStyle: string;
  /** Default Bootstrap column class for collection values. */
  defaultCollectionsValueColStyle: string;
  /** Whether to render collections inline rather than stacked. */
  isInline: boolean;
  /** Optional CSS classes for the collections row container. */
  defaultCollectionsRowStyle?: string;
}

/**
 * Configuration mapping entity types to their item page layout orientation.
 * Must include a 'default' key as fallback for entity types without explicit configuration.
 */
export interface DynamicItemPageConfig extends Config {
  /** Layout configuration for a specific entity type (key = entity type label). */
  [entity: string]: DynamicLayoutTypeConfig;
  /** Default layout configuration used when no entity-specific config is found. */
  default: DynamicLayoutTypeConfig;
}

/**
 * Configuration mapping metadata field names to CSS class names for dynamic reference styling.
 * Must include a 'default' key as fallback.
 */
export interface DynamicRefStyleMetadata extends Config {
  /** CSS class for a specific metadata field (key = metadata field name). */
  [metadata: string]: string;
  /** Default CSS class used when no specific metadata match is found. */
  default: string;
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

  /**
   * Metadata that holds information about the style
   */
  dynamicRefStyleMetadata: DynamicRefStyleMetadata,
}
