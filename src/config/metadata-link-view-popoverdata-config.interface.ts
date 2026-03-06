export interface MetadataLinkViewPopoverDataConfig {
  /**
   * The list of entity types to display the metadata for
   */
  entityDataConfig: EntityDataConfig[];

  /**
   * The list of metadata keys to fallback to
   */
  fallbackMetdataList: string[];
}


export interface EntityDataConfig {
  /**
   * The metadata entity type
   */
  entityType: string;
  /**
   * The list of metadata keys to display
   */
  metadataList: string[];
  /**
  * The list of title metadata keys to display as title (optional as default is on dc.title)
  **/
  titleMetadataList?: string[];
}
