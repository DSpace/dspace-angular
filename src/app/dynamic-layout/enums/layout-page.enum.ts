/**
 * This enum contains the types of layout pages.
 * It is used to determine which component to use for render a specific item.
 * To overwrite the layout page of a specific item its entityType must be entered as a value
 */

export enum LayoutPage {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal'
}

/**
 * The default page is always applied by the component resolver as a fallback value;
 */
export const DEFAULT_LAYOUT_PAGE = LayoutPage.VERTICAL;
