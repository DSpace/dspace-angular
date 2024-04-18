import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { Context } from '../../../../core/shared/context.model';
import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { WorkspaceItem } from '../../../../core/submission/models/workspaceitem.model';
import { isNotUndefined } from '../../../empty.util';
import { WorkspaceitemActionsComponent } from '../../../mydspace-actions/workspaceitem/workspaceitem-actions.component';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { WorkspaceItemSearchResult } from '../../../object-collection/shared/workspace-item-search-result.model';
import { followLink } from '../../../utils/follow-link-config.model';
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
export class WorkspaceItemSearchResultDetailElementComponent extends SearchResultDetailElementComponent<WorkspaceItemSearchResult, WorkspaceItem> {

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
  ngOnInit() {
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
