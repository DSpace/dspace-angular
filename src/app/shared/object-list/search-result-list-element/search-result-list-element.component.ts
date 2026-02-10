import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { Metadata } from '@dspace/core/shared/metadata.utils';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { Observable } from 'rxjs';

import { MetadataValue } from '../../../core/shared/metadata.models';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { TruncatableService } from '../../truncatable/truncatable.service';

@Component({
  selector: 'ds-search-result-list-element',
  template: ``,
})
export class SearchResultListElementComponent<T extends SearchResult<K>, K extends DSpaceObject> extends AbstractListableElementComponent<T> implements OnInit {
  /**
   * The DSpaceObject of the search result
   */
  dso: K;
  dsoTitle: string;

  public constructor(protected truncatableService: TruncatableService,
                     public dsoNameService: DSONameService,
                     @Inject(APP_CONFIG) protected appConfig?: AppConfig) {
    super(dsoNameService);
  }

  /**
   * Retrieve the dso from the search result
   */
  ngOnInit(): void {
    if (hasValue(this.object)) {
      this.dso = this.object.indexableObject;
      this.dsoTitle = this.dsoNameService.getHitHighlights(this.object, this.dso, true);
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
   * Gets all matching metadata string values from hitHighlights or dso metadata.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @param escapeHTML Whether the HTML is used inside a `[innerHTML]` attribute. Defaults to `true` because we
   * always use `[innerHTML]` in the templates to render metadata due to the hit highlights.
   * @returns {string[]} the matching string values or an empty array.
   */
  allMetadataValues(keyOrKeys: string | string[], escapeHTML = true): string[] {
    const dsoMetadata: string[] = Metadata.allValues(this.dso.metadata, keyOrKeys, undefined, undefined, escapeHTML);
    const highlights: string[] = Metadata.allValues({}, keyOrKeys, this.object.hitHighlights, undefined, escapeHTML);
    const removedHighlights: string[] = highlights.map(str => str.replace(/<\/?em>/g, ''));
    for (let i = 0; i < removedHighlights.length; i++) {
      const index = dsoMetadata.indexOf(removedHighlights[i]);
      if (index !== -1) {
        dsoMetadata[index] = highlights[i];
      }
    }
    return dsoMetadata;
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
   * @param escapeHTML Whether the HTML is used inside a `[innerHTML]` attribute. Defaults to `true` because we
   * always use `[innerHTML]` in the templates to render metadata due to the hit highlights.
   * @returns {string} the first matching string value, or `undefined`.
   */
  firstMetadataValue(keyOrKeys: string | string[], escapeHTML = true): string {
    return Metadata.firstValue(this.dso.metadata, keyOrKeys, this.object.hitHighlights, undefined, escapeHTML);
  }

  /**
   * Emits if the list element is currently collapsed or not
   */
  isCollapsed(): Observable<boolean> {
    return this.truncatableService.isCollapsed(this.dso.id);
  }

}
