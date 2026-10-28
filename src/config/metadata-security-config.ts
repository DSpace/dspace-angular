import { Config } from './config.interface';

/**
 * Configuration for the metadata security feature, defining the list of
 * security levels available across the application.
 *
 * Consumed by {@link EditMetadataSecurityComponent} to render the security
 * level toggle buttons for metadata fields.
 *
 * @see LevelSecurityConfig
 */
export interface MetadataSecurityConfig extends Config {
  levels: LevelSecurityConfig[];
}

/**
 * Configuration for a single metadata security level entry,
 * defining its numeric value and how it is visually represented
 * in the UI (icon and color).
 *
 * @example
 * { value: 0, icon: 'fas fa-globe', color: 'success' }  // Public
 * { value: 1, icon: 'fas fa-user', color: 'warning' }   // Registered users
 * { value: 2, icon: 'fas fa-lock', color: 'danger' }    // Administrators
 */
export interface LevelSecurityConfig extends Config {
  value: number;
  icon: string;
  color: string;
}
