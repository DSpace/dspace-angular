import {
  Component,
  OnInit,
} from '@angular/core';
import { isNotUndefined } from '@dspace/shared/utils';
import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';
import { Context } from '../../../../../../modules/core/src/lib/core/shared/context.model';

import { DSONameService } from '../../../../../../modules/core/src/lib/core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../../../modules/core/src/lib/core/cache/builders/link.service';
import { followLink } from '../../../../../../modules/core/src/lib/core/data/follow-link-config.model';
import { RemoteData } from '../../../../../../modules/core/src/lib/core/data/remote-data';
import { WorkflowItemSearchResult } from '../../../../../../modules/core/src/lib/core/object-collection/workflow-item-search-result.model';
import { Item } from '../../../../../../modules/core/src/lib/core/shared/item.model';
import { ViewMode } from '../../../../../../modules/core/src/lib/core/shared/view-mode.model';
import { WorkflowItem } from '../../../../../../modules/core/src/lib/core/submission/models/workflowitem.model';
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
  imports: [ItemDetailPreviewComponent, WorkflowitemActionsComponent],
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
