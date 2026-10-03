/**
 * This enum contains the types of layout tabs.
 * It is used to determine which component to use for render a tab of a specific item.
 * To overwrite a specific tab its shortname must be entered as a value.
 */
export enum LayoutTab {
  DEFAULT = 'defaultLayoutTab',
  ORCID = 'orcid'
}

/**
 * The default tab is applied by the component resolver as a fallback value;
 */
export const DEFAULT_LAYOUT_TAB = LayoutTab.DEFAULT;
