import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SearchResult } from '../../search/search-result.model';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Metadata } from '../../../core/shared/metadata.utils';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { hasValue } from '../../empty.util';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { TruncatableService } from '../../truncatable/truncatable.service';

@Component({
  selector: 'ds-search-result-grid-element',
  template: ``
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
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService
  ) {
    super();
    if (hasValue(this.object)) {
      this.isCollapsed$ = this.isCollapsed();
    }
  }

  /**
   * Retrieve the dso from the search result
   */
  ngOnInit(): void {
    if (hasValue(this.object)) {
      this.dso = this.object.indexableObject;
    }
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

  private isCollapsed(): Observable<boolean> {
    return this.truncatableService.isCollapsed(this.dso.id);
  }

  // TODO refactor to return RemoteData, and thumbnail template to deal with loading
  getThumbnail(): Observable<Bitstream> {
    return this.bitstreamDataService.getThumbnailFor(this.dso as any).pipe(
      getFirstSucceededRemoteDataPayload()
    );
  }
}
