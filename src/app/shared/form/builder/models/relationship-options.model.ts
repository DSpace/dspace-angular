const RELATION_METADATA_PREFIX = "relation."

export class RelationshipOptions {
  relationshipType: string;
  filter: string;
  searchConfiguration: string;
  nameVariants: boolean;

  get metadataField() {
    return RELATION_METADATA_PREFIX + this.relationshipType
  }
}
