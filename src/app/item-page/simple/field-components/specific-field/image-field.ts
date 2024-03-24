
/**
 * Interface that encapsulate Image configuration for this component.
 */
export interface ImageField {
  /**
   * URI that is used to retrieve the image.
   */
  URI: string;
  /**
   * i18n Key that represents the alt text to display
   */
  alt: string;
  /**
   * CSS variable that contains the height of the inline image.
   */
  heightVar: string;
}
