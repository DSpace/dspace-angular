import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { find, map } from 'rxjs/operators';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { Item } from '../../../../core/shared/item.model';

import { ViewMode } from '../../../../core/shared/view-mode.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { isNotUndefined } from '../../../empty.util';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { WorkflowItemSearchResult } from '../../../object-collection/shared/workflow-item-search-result.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { followLink } from '../../../utils/follow-link-config.model';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';

/**
 * This component renders workflowitem object for the search result in the list view.
 */
@Component({
  selector: 'ds-workflow-item-my-dspace-result-list-element',
  styleUrls: ['../../search-result-list-element/search-result-list-element.component.scss'],
  templateUrl: './workflow-item-search-result-list-element.component.html',
})

@listableObjectComponent(WorkflowItemSearchResult, ViewMode.ListElement)
export class WorkflowItemSearchResultListElementComponent extends SearchResultListElementComponent<WorkflowItemSearchResult, WorkflowItem> {

  /**
   * The item object that belonging to the result object
   */
  public item$: Observable<Item>;

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.WORKFLOW;

  constructor(
    protected truncatableService: TruncatableService,
    protected linkService: LinkService
  ) {
    super(truncatableService);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    super.ngOnInit();
    this.linkService.resolveLink(this.dso, followLink('item'));
    this.initItem(this.dso.item as Observable<RemoteData<Item>> );
  }

  /**
   * Retrieve item from result object
   */
  initItem(item$: Observable<RemoteData<Item>>) {
    this.item$ = item$.pipe(
      find((rd: RemoteData<Item>) => rd.hasSucceeded && isNotUndefined(rd.payload)),
      map((rd: RemoteData<Item>) => rd.payload)
    );
  }

}
