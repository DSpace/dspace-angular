import { Config } from './config.interface';

/**
 * Config that determines the access control screen
 */
export interface AccessControlConfig extends Config {

  epeople: {
    /**
     * Number of entries in the epeople list in the access controll page.
     * Rounded to the nearest size in the list of selectable sizes on the settings
     * menu.  See pageSizeOptions in 'pagination-component-options.model.ts'.
     */
    pageSize: number;
  };

  groups: {
    /**
     * Number of entries in the group list in the access controll page.
     * Rounded to the nearest size in the list of selectable sizes on the settings
     * menu.  See pageSizeOptions in 'pagination-component-options.model.ts'.
     */
    pageSize: number;
  }

}
