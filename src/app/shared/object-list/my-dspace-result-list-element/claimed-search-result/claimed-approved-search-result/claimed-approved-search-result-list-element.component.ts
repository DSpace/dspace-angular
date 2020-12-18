import { Component } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { ClaimedApprovedTaskSearchResult } from '../../../../object-collection/shared/claimed-approved-task-search-result.model';
import { listableObjectComponent } from '../../../../object-collection/shared/listable-object/listable-object.decorator';
import { AbstractClaimedSearchResultListElementComponent } from '../abstract-claimed-search-result-list-element.component';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { MyDspaceItemStatusType } from '../../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';

/**
 * This component renders claimed task approved object for the search result in the list view.
 */
@Component({
  selector: 'ds-claimed-approved-search-result-list-element',
  styleUrls: ['../../../search-result-list-element/search-result-list-element.component.scss'],
  templateUrl: './claimed-approved-search-result-list-element.component.html',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})

@listableObjectComponent(ClaimedApprovedTaskSearchResult, ViewMode.ListElement)
export class ClaimedApprovedSearchResultListElementComponent extends AbstractClaimedSearchResultListElementComponent {

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.APPROVED;

  constructor(
    protected linkService: LinkService,
    protected truncatableService: TruncatableService
  ) {
    super(linkService, truncatableService);
  }

}
