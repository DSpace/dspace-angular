import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BitstreamDataService,
  Community,
  CommunitySearchResult,
  DSONameService,
  followLink,
  LinkService,
  ViewMode,
} from '@dspace/core';
import {
  hasNoValue,
  hasValue,
} from '@dspace/shared/utils';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';
import { ThemedBadgesComponent } from '../../../object-collection/shared/badges/themed-badges.component';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';

@Component({
  selector: 'ds-community-search-result-grid-element',
  styleUrls: [
    '../search-result-grid-element.component.scss',
    'community-search-result-grid-element.component.scss',
  ],
  templateUrl: 'community-search-result-grid-element.component.html',
  standalone: true,
  imports: [RouterLink, ThemedThumbnailComponent, ThemedBadgesComponent, AsyncPipe, TranslateModule],
})
/**
 * Component representing a grid element for a community search result
 */
@listableObjectComponent(CommunitySearchResult, ViewMode.GridElement)
export class CommunitySearchResultGridElementComponent extends SearchResultGridElementComponent<CommunitySearchResult,Community> {
  private _dso: Community;

  constructor(
    public dsoNameService: DSONameService,
    private linkService: LinkService,
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
  ) {
    super(dsoNameService, truncatableService, bitstreamDataService);
  }

  // @ts-ignore
  @Input() set dso(dso: Community) {
    this._dso = dso;
    if (hasValue(this._dso) && hasNoValue(this._dso.logo)) {
      this.linkService.resolveLink<Community>(this._dso, followLink('logo'));
    }
  }

  get dso(): Community {
    return this._dso;
  }
}
