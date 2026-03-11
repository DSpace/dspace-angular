
import { Relationship } from './relationship.model';
import { Reorderable } from './reordable';

/**
 * Represents a single relationship that can be reordered in a list of multiple relationships
 */
export class ReorderableRelationship extends Reorderable {

  constructor(
    public relationship: Relationship,
    public useLeftItem: boolean,
    oldIndex?: number,
    newIndex?: number) {
    super(oldIndex, newIndex);
    this.relationship = relationship;
    this.useLeftItem = useLeftItem;
  }

  /**
   * Return the id for this Reorderable
   */
  getId(): string {
    return this.relationship.id;
  }

  /**
   * Return the place metadata for this Reorderable
   */
  getPlace(): number {
    if (this.useLeftItem) {
      return this.relationship.rightPlace;
    } else {
      return this.relationship.leftPlace;
    }
  }
}
