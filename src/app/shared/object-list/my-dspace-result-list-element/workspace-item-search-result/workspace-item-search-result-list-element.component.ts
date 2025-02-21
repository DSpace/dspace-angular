import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DSONameService } from '@dspace/core';
import { LinkService } from '@dspace/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/core';
import { followLink } from '@dspace/core';
import { ItemSearchResult } from '@dspace/core';
import { WorkspaceItemSearchResult } from '@dspace/core';
import { Context } from '@dspace/core';
import { Item } from '@dspace/core';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core';
import { ViewMode } from '@dspace/core';
import { WorkspaceItem } from '@dspace/core';
import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';
import { WorkspaceitemActionsComponent } from '../../../mydspace-actions/workspaceitem/workspaceitem-actions.component';
import { CollectionElementLinkType } from '../../../object-collection/collection-element-link.type';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { ListableObjectComponentLoaderComponent } from '../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';

/**
 * This component renders workspaceitem object for the search result in the list view.
 */
@Component({
  selector: 'ds-workspace-item-search-result-list-element',
  styleUrls: ['../../search-result-list-element/search-result-list-element.component.scss', './workspace-item-search-result-list-element.component.scss'],
  templateUrl: './workspace-item-search-result-list-element.component.html',
  standalone: true,
  imports: [ListableObjectComponentLoaderComponent, NgClass, WorkspaceitemActionsComponent, ThemedLoadingComponent, AsyncPipe],
})

@listableObjectComponent(WorkspaceItemSearchResult, ViewMode.ListElement)
export class  WorkspaceItemSearchResultListElementComponent extends SearchResultListElementComponent<WorkspaceItemSearchResult, WorkspaceItem> implements OnInit {
  LinkTypes = CollectionElementLinkType;

  ViewModes = ViewMode;

  /**
   * The item search result derived from the WorkspaceItemSearchResult
   */
  derivedSearchResult$: BehaviorSubject<ItemSearchResult> = new BehaviorSubject(undefined);

  /**
   * Represents the badge context
   */
  public badgeContext = Context.MyDSpaceWorkspace;

  /**
   * Display thumbnails if required by configuration
   */
  showThumbnails: boolean;

  constructor(
    protected truncatableService: TruncatableService,
    protected linkService: LinkService,
    public dsoNameService: DSONameService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super(truncatableService, dsoNameService, appConfig);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.deriveSearchResult();
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
  }

  private deriveSearchResult() {
    this.linkService.resolveLink(this.object.indexableObject, followLink('item'));
    this.object.indexableObject.item.pipe(
      getFirstSucceededRemoteDataPayload(),
    ).subscribe((item: Item) => {
      const result = new ItemSearchResult();
      this.derivedSearchResult$.next(Object.assign(new ItemSearchResult(), {
        indexableObject: item,
        hitHighlights: this.object.hitHighlights,
      }));
    });
  }
}
