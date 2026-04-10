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
