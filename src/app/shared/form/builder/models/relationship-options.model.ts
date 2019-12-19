const RELATION_METADATA_PREFIX = 'relation.'

/**
 * Extra options for displaying search results of relationships
 */
export class RelationshipOptions {
  relationshipType: string;
  filter: string;
  searchConfiguration: string;
  nameVariants: boolean;

  get metadataField() {
    return RELATION_METADATA_PREFIX + this.relationshipType
  }
}
