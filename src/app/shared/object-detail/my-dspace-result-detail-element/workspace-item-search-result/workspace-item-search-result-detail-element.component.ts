import {
  Component,
  OnInit,
} from '@angular/core';
import { isNotUndefined } from '@dspace/shared/utils';
import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { DSONameService } from '@dspace/core';
import { LinkService } from '@dspace/core';
import { followLink } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { WorkspaceItemSearchResult } from '@dspace/core';
import { Context } from '@dspace/core';
import { Item } from '@dspace/core';
import { ViewMode } from '@dspace/core';
import { WorkspaceItem } from '@dspace/core';
import { WorkspaceitemActionsComponent } from '../../../mydspace-actions/workspaceitem/workspaceitem-actions.component';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { ItemDetailPreviewComponent } from '../item-detail-preview/item-detail-preview.component';
import { SearchResultDetailElementComponent } from '../search-result-detail-element.component';

/**
 * This component renders workspace item object for the search result in the detail view.
 */
@Component({
  selector: 'ds-workspace-item-search-result-detail-element',
  styleUrls: ['../search-result-detail-element.component.scss', './workspace-item-search-result-detail-element.component.scss'],
  templateUrl: './workspace-item-search-result-detail-element.component.html',
  standalone: true,
  imports: [ItemDetailPreviewComponent, WorkspaceitemActionsComponent],
})

@listableObjectComponent(WorkspaceItemSearchResult, ViewMode.DetailedListElement)
export class WorkspaceItemSearchResultDetailElementComponent extends SearchResultDetailElementComponent<WorkspaceItemSearchResult, WorkspaceItem> implements OnInit {

  /**
   * The item object that belonging to the result object
   */
  public item: Item;

  /**
   * Represents the badge context
   */
  public badgeContext = Context.MyDSpaceWorkspace;

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
