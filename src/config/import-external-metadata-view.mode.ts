/**
 * Represents the view modes for metadatafield names in the external import preview modal.
 */
export enum ImportExternalMetadataViewMode {
  /**
   * Hide metadatafield names (show only labels).
   */
  Disable = 'disable',
  /**
   * Show tooltip with field name.
   */
  Tooltip = 'tooltip',
  /**
   * Show field name in parentheses.
   */
  Labeled = 'labeled',
  /**
   * Show both labeled and tooltip modes.
   */
  Full = 'full',

  Default = Tooltip,
}
