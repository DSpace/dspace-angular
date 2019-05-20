import { Component, Inject } from '@angular/core';

import { MyDSpaceResult } from '../../../+my-dspace-page/my-dspace-result.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ListableObject } from '../../object-collection/shared/listable-object.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Metadata } from '../../../core/shared/metadata.utils';

@Component({
  selector: 'ds-my-dspace-result-list-element',
  template: ``
})
export class MyDSpaceResultListElementComponent<T extends MyDSpaceResult<K>, K extends DSpaceObject> extends AbstractListableElementComponent<T> {

  /**
   * The result element object
   */
  dso: K;

  /**
   * The array index of the result element
   */
  dsoIndex: number;

  /**
   * Initialize instance variables
   *
   * @param {ListableObject} listable
   * @param {number} index
   */
  public constructor(@Inject('objectElementProvider') public listable: ListableObject,
                     @Inject('indexElementProvider') public index: number) {
    super(listable);
    this.dso = this.object.indexableObject;
    this.dsoIndex = this.index;
  }

  /**
   * Gets all matching metadata string values from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @returns {string[]} the matching string values or an empty array.
   */
  allMetadataValues(keyOrKeys: string | string[]): string[] {
    return Metadata.allValues([this.object.hitHighlights, this.dso.metadata], keyOrKeys);
  }

  /**
   * Gets the first matching metadata string value from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @returns {string} the first matching string value, or `undefined`.
   */
  firstMetadataValue(keyOrKeys: string | string[]): string {
    return Metadata.firstValue([this.object.hitHighlights, this.dso.metadata], keyOrKeys);
  }

}
