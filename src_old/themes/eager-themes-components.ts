// import { COMPONENTS as CUSTOM_THEME_EAGER_COMPONENTS } from './custom/eager-theme-components';
import { COMPONENTS as DSPACE_THEME_EAGER_COMPONENTS } from './dspace/eager-theme-components';

/**
 * This list bundles the eager components from all the enable themes.
 * Eager components are components that are present on every page (to speed up initial loading)
 * and entry components (to ensure their decorators get picked up).
 *
 * Themes that aren't in use should not be imported here, so they don't take up unnecessary space in the main bundle.
 */
export const EAGER_THEME_COMPONENTS = [
  // ...CUSTOM_THEME_EAGER_COMPONENTS,
  ...DSPACE_THEME_EAGER_COMPONENTS,
];
