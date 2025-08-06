import {
  Component,
  OnInit,
} from '@angular/core';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Context } from '@dspace/core/shared/context.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import { WorkflowItemSearchResult } from '@dspace/core/shared/object-collection/workflow-item-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { WorkflowItem } from '@dspace/core/submission/models/workflowitem.model';
import { isNotUndefined } from '@dspace/shared/utils/empty.util';
import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { WorkflowitemActionsComponent } from '../../../mydspace-actions/workflowitem/workflowitem-actions.component';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { ItemDetailPreviewComponent } from '../item-detail-preview/item-detail-preview.component';
import { SearchResultDetailElementComponent } from '../search-result-detail-element.component';

/**
 * This component renders workflowitem object for the search result in the detail view.
 */
@Component({
  selector: 'ds-workflow-item-search-result-detail-element',
  styleUrls: ['../search-result-detail-element.component.scss'],
  templateUrl: './workflow-item-search-result-detail-element.component.html',
  standalone: true,
  imports: [
    ItemDetailPreviewComponent,
    WorkflowitemActionsComponent,
  ],
})

@listableObjectComponent(WorkflowItemSearchResult, ViewMode.DetailedListElement)
export class WorkflowItemSearchResultDetailElementComponent extends SearchResultDetailElementComponent<WorkflowItemSearchResult, WorkflowItem> implements OnInit {

  /**
   * The item object that belonging to the result object
   */
  public item: Item;

  /**
   * Represents the badge context
   */
  public badgeContext = Context.MyDSpaceWorkflow;

  constructor(
    public dsoNameService: DSONameService,
    protected linkService: LinkService,
  ) {
    super(dsoNameService);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.linkService.resolveLink(this.dso, followLink('item'));
    this.initItem(this.dso.item as Observable<RemoteData<Item>>);
  }

  /**
   * Retrieve item from result object
   */
  initItem(item$: Observable<RemoteData<Item>>) {
    item$.pipe(
      find((rd: RemoteData<Item>) => rd.hasSucceeded && isNotUndefined(rd.payload)),
    ).subscribe((rd: RemoteData<Item>) => {
      this.item = rd.payload;
    });
  }

}
