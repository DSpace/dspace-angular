import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { Item } from '../../../../core/shared/item.model';

import { ViewMode } from '../../../../core/shared/view-mode.model';
import { WorkspaceItem } from '../../../../core/submission/models/workspaceitem.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { WorkspaceItemSearchResult } from '../../../object-collection/shared/workspace-item-search-result.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { map } from 'rxjs/operators';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { CollectionElementLinkType } from '../../../object-collection/collection-element-link.type';
import { followLink } from '../../../utils/follow-link-config.model';

/**
 * This component renders workspaceitem object for the search result in the list view.
 */
@Component({
  selector: 'ds-workspace-item-search-result-list-element',
  styleUrls: ['../../search-result-list-element/search-result-list-element.component.scss', './workspace-item-search-result-list-element.component.scss'],
  templateUrl: './workspace-item-search-result-list-element.component.html',
})

@listableObjectComponent(WorkspaceItemSearchResult, ViewMode.ListElement)
export class  WorkspaceItemSearchResultListElementComponent extends SearchResultListElementComponent<WorkspaceItemSearchResult, WorkspaceItem> {
  LinkTypes = CollectionElementLinkType;

  ViewModes = ViewMode;

  /**
   * The item search result derived from the WorkspaceItemSearchResult
   */
  derivedSearchResult$: Observable<ItemSearchResult>;

  /**
   * Represent item's status
   */
  status = MyDspaceItemStatusType.WORKSPACE;

  constructor(
    protected truncatableService: TruncatableService,
    protected linkService: LinkService,
    protected dsoNameService: DSONameService
  ) {
    super(truncatableService, dsoNameService);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    super.ngOnInit();
    this.deriveSearchResult();
  }

  private deriveSearchResult() {
    this.linkService.resolveLink(this.object.indexableObject, followLink('item'));
    this.derivedSearchResult$ = this.object.indexableObject.item.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item: Item) => {
      const result = new ItemSearchResult();
      result.indexableObject = item;
      result.hitHighlights = this.object.hitHighlights;
      return result;
    }));
  }
}
