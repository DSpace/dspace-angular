import { Component } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { AbstractClaimedSearchResultListElementComponent } from '../abstract-claimed-search-result-list-element.component';
import { listableObjectComponent } from '../../../../object-collection/shared/listable-object/listable-object.decorator';
import { ClaimedDeclinedTaskSearchResult } from '../../../../object-collection/shared/claimed-declined-task-search-result.model';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { MyDspaceItemStatusType } from '../../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';

/**
 * This component renders claimed task declined object for the search result in the list view.
 */
@Component({
  selector: 'ds-claimed-declined-search-result-list-element',
  styleUrls: ['../../../search-result-list-element/search-result-list-element.component.scss'],
  templateUrl: './claimed-declined-search-result-list-element.component.html',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})

@listableObjectComponent(ClaimedDeclinedTaskSearchResult, ViewMode.ListElement)
export class ClaimedDeclinedSearchResultListElementComponent extends AbstractClaimedSearchResultListElementComponent {

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.DECLINED;

  constructor(
    protected linkService: LinkService,
    protected truncatableService: TruncatableService
  ) {
    super(linkService, truncatableService);
  }

}
