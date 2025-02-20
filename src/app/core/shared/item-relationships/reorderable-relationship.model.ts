import { Store } from '@ngrx/store';

import { CoreState } from '../../core-state.model';
import { Relationship } from './relationship.model';

/**
 * Abstract class that defines objects that can be reordered
 */
export abstract class Reorderable {

  constructor(public oldIndex?: number, public newIndex?: number) {
  }

  /**
   * Return the id for this Reorderable
   */
  abstract getId(): string;

  /**
   * Return the place metadata for this Reorderable
   */
  abstract getPlace(): number;

  /**
   * Update the Reorderable
   */
  update(): void {
    this.oldIndex = this.newIndex;
  }

  /**
   * Returns true if the oldIndex of this Reorderable
   * differs from the newIndex
   */
  get hasMoved(): boolean {
    return this.oldIndex !== this.newIndex;
  }
}

/**
 * Represents a single relationship that can be reordered in a list of multiple relationships
 */
export class ReorderableRelationship extends Reorderable {

  constructor(
    public relationship: Relationship,
    public useLeftItem: boolean,
    protected store: Store<CoreState>,
    protected submissionID: string,
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
