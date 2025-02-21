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

import { DSONameService } from '../../../../../../modules/core/src/lib/core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../../../modules/core/src/lib/core/cache/builders/link.service';
import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../../modules/core/src/lib/core/config/app-config.interface';
import { followLink } from '../../../../../../modules/core/src/lib/core/data/follow-link-config.model';
import { ItemSearchResult } from '../../../../../../modules/core/src/lib/core/object-collection/item-search-result.model';
import { WorkspaceItemSearchResult } from '../../../../../../modules/core/src/lib/core/object-collection/workspace-item-search-result.model';
import { Context } from '../../../../../../modules/core/src/lib/core/shared/context.model';
import { Item } from '../../../../../../modules/core/src/lib/core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../modules/core/src/lib/core/shared/operators';
import { ViewMode } from '../../../../../../modules/core/src/lib/core/shared/view-mode.model';
import { WorkspaceItem } from '../../../../../../modules/core/src/lib/core/submission/models/workspaceitem.model';
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
