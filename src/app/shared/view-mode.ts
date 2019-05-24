/**
 * Enum used for defining the view-mode of a set of elements
 * List   Display the elements in a (vertical) list
 * Grid   Display the elements in a grid
 */
export enum SetViewMode {
  List = 'list',
  Grid = 'grid',
  Detail = 'detail'
}

/**
 * ViewMode refers to either a SetViewMode or ElementViewMode
 */
export type ViewMode = SetViewMode;
