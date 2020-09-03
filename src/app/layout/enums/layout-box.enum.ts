/**
 * This enum contains the boxes types
 * It is used to determine which component to use for render a specific box.
 * To overwrite a box its boxType must be entered as a value.
 */
export enum LayoutBox {
  METADATA = 'METADATA',
  SEARCH = 'SEARCH',
  RELATION = 'RELATION'
}
