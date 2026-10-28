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
 * Top-level layout configuration for UI visual customization.
 *
 * Provides configuration for customizing the visual appearance and layout of entities
 * Currently supports authority reference styling for displaying icons and styles for different entity types (persons, organizations, projects, etc.).
 * @see AuthorityRefConfig
 * @see AppConfig
 */
export interface LayoutConfig extends Config {
  /**
   * Array of authority reference configurations for different entity types.
   * Each entry defines how entities of a specific type should be visually represented with icons and styles.
   */
  authorityRef: AuthorityRefConfig[];
  showDownloadLinkAsAttachment: boolean;
  /**
   * Configuration for advanced attachment rendering features.
   * Controls pagination and metadata display for bitstream attachments.
   */
  advancedAttachmentRendering: AdvancedAttachmentRenderingConfig;
}
