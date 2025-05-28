import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { Collection } from '../../../../core/shared/collection.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';
import {
  hasNoValue,
  hasValue,
} from '../../../empty.util';
import { ThemedBadgesComponent } from '../../../object-collection/shared/badges/themed-badges.component';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { followLink } from '../../../utils/follow-link-config.model';
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
