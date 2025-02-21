import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DSONameService } from '../../../../../../../modules/core/src/lib/core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '../../../../../../../modules/core/src/lib/core/data/bitstream-data.service';
import { ItemSearchResult } from '../../../../../../../modules/core/src/lib/core/object-collection/item-search-result.model';
import { Item } from '../../../../../../../modules/core/src/lib/core/shared/item.model';
import { ViewMode } from '../../../../../../../modules/core/src/lib/core/shared/view-mode.model';
import { getItemPageRoute } from '../../../../../item-page/item-page-routing-paths';
import { ThemedThumbnailComponent } from '../../../../../thumbnail/themed-thumbnail.component';
import { focusShadow } from '../../../../animations/focus';
import { ThemedBadgesComponent } from '../../../../object-collection/shared/badges/themed-badges.component';
import { listableObjectComponent } from '../../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatableComponent } from '../../../../truncatable/truncatable.component';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { TruncatablePartComponent } from '../../../../truncatable/truncatable-part/truncatable-part.component';
import { SearchResultGridElementComponent } from '../../search-result-grid-element.component';

@listableObjectComponent('PublicationSearchResult', ViewMode.GridElement)
@listableObjectComponent(ItemSearchResult, ViewMode.GridElement)
@Component({
  selector: 'ds-item-search-result-grid-element',
  styleUrls: ['./item-search-result-grid-element.component.scss'],
  templateUrl: './item-search-result-grid-element.component.html',
  animations: [focusShadow],
  standalone: true,
  imports: [RouterLink, ThemedThumbnailComponent, ThemedBadgesComponent, TruncatableComponent, TruncatablePartComponent, AsyncPipe, TranslateModule],
})
/**
 * The component for displaying a grid element for an item search result of the type Publication
 */
export class ItemSearchResultGridElementComponent extends SearchResultGridElementComponent<ItemSearchResult, Item> implements OnInit {
  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  dsoTitle: string;

  constructor(
    public dsoNameService: DSONameService,
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
  ) {
    super(dsoNameService, truncatableService, bitstreamDataService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.itemPageRoute = getItemPageRoute(this.dso);
    this.dsoTitle = this.dsoNameService.getHitHighlights(this.object, this.dso);
  }
}
