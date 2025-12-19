/**
 * Represents the configuration for identifier subtypes.
 */
export interface IdentifierSubtypesConfig {
  name: string; // The name of the identifier subtype
  icon: string; // The icon to display for the identifier subtype
  iconPosition: IdentifierSubtypesIconPositionEnum; // The position of the icon relative to the identifier
  link: string; // The link to navigate to when the icon is clicked
}

export enum IdentifierSubtypesIconPositionEnum {
  NONE = 'NONE',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}
