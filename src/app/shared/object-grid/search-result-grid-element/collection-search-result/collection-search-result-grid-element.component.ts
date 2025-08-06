import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { CollectionSearchResult } from '@dspace/core/shared/object-collection/collection-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import {
  hasNoValue,
  hasValue,
} from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';
import { ThemedBadgesComponent } from '../../../object-collection/shared/badges/themed-badges.component';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';

@Component({
  selector: 'ds-collection-search-result-grid-element',
  styleUrls: ['../search-result-grid-element.component.scss', 'collection-search-result-grid-element.component.scss'],
  templateUrl: 'collection-search-result-grid-element.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    ThemedBadgesComponent,
    ThemedThumbnailComponent,
    TranslateModule,
  ],
})
/**
 * Component representing a grid element for a collection search result
 */
@listableObjectComponent(CollectionSearchResult, ViewMode.GridElement)
export class CollectionSearchResultGridElementComponent extends SearchResultGridElementComponent< CollectionSearchResult, Collection > {
  private _dso: Collection;

  constructor(
    public dsoNameService: DSONameService,
    private linkService: LinkService,
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
  ) {
    super(dsoNameService, truncatableService, bitstreamDataService);
  }

  // @ts-ignore
  @Input() set dso(dso: Collection) {
    this._dso = dso;
    if (hasValue(this._dso) && hasNoValue(this._dso.logo)) {
      this.linkService.resolveLink<Collection>(
        this._dso,
        followLink('logo'),
      );
    }
  }

  get dso(): Collection {
    return this._dso;
  }
}
