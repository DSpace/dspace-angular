/**
 * Enum used for defining the view-mode of a set of elements
 * List   Display the elements in a (vertical) list
 * Grid   Display the elements in a grid
 */
export enum SetViewMode {
  List = 'list',
  Grid = 'grid'
}

/**
 * Enum used for defining the view-mode of a single element
 * Full         Display the full element
 * SetElement   Display the element as part of a set
 */
export enum ElementViewMode {
  Full,
  SetElement
}

/**
 * ViewMode refers to either a SetViewMode or ElementViewMode
 */
export type ViewMode = SetViewMode | ElementViewMode;
