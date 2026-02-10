import {
  Component,
  OnInit,
} from '@angular/core';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { Metadata } from '@dspace/core/shared/metadata.utils';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { Observable } from 'rxjs';

import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { TruncatableService } from '../../truncatable/truncatable.service';

@Component({
  selector: 'ds-search-result-grid-element',
  template: ``,
})
export class SearchResultGridElementComponent<T extends SearchResult<K>, K extends DSpaceObject> extends AbstractListableElementComponent<T> implements OnInit {
  /**
   * The DSpaceObject of the search result
   */
  dso: K;

  /**
   * Whether or not the grid element is currently collapsed
   */
  isCollapsed$: Observable<boolean>;

  public constructor(
    public dsoNameService: DSONameService,
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
  ) {
    super(dsoNameService);
  }

  /**
   * Retrieve the dso from the search result
   */
  ngOnInit(): void {
    if (hasValue(this.object)) {
      this.dso = this.object.indexableObject;
      this.isCollapsed$ = this.isCollapsed();
    }
  }

  /**
   * Gets all matching metadata values from hitHighlights or dso metadata.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @returns {MetadataValue[]} the matching values or an empty array.
   */
  allMetadata(keyOrKeys: string | string[]): MetadataValue[] {
    const dsoMetadata: MetadataValue[] = Metadata.all(this.dso.metadata, keyOrKeys);
    const highlights: MetadataValue[] = Metadata.all(this.object.hitHighlights, keyOrKeys);
    const removedHighlights: string[] = highlights.map(mv => mv.value.replace(/<\/?em>/g, ''));
    for (let i = 0; i < removedHighlights.length; i++) {
      const index = dsoMetadata.findIndex(mv => mv.value === removedHighlights[i]);
      if (index !== -1) {
        dsoMetadata[index] = highlights[i];
      }
    }
    return dsoMetadata;
  }

  /**
   * Gets all matching metadata string values from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @param escapeHTML Whether the HTML is used inside a `[innerHTML]` attribute
   * @returns {string[]} the matching string values or an empty array.
   */
  allMetadataValues(keyOrKeys: string | string[], escapeHTML = true): string[] {
    return Metadata.allValues(this.dso.metadata, keyOrKeys, this.object.hitHighlights, undefined, escapeHTML);
  }

  /**
   * Gets the first matching metadata value from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @returns {MetadataValue} the first matching value, or `undefined`.
   */
  firstMetadata(keyOrKeys: string | string[]): MetadataValue {
    return Metadata.first(this.dso.metadata, keyOrKeys, this.object.hitHighlights);
  }

  /**
   * Gets the first matching metadata string value from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @param escapeHTML Whether the HTML is used inside a `[innerHTML]` attribute
   * @returns {string} the first matching string value, or `undefined`.
   */
  firstMetadataValue(keyOrKeys: string | string[], escapeHTML = true): string {
    return Metadata.firstValue(this.dso.metadata, keyOrKeys, this.object.hitHighlights, undefined, escapeHTML);
  }

  private isCollapsed(): Observable<boolean> {
    return this.truncatableService.isCollapsed(this.dso.id);
  }
}
