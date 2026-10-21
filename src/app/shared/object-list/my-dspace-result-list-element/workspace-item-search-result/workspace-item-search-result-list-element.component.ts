import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { Context } from '@dspace/core/shared/context.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { WorkspaceItemSearchResult } from '@dspace/core/shared/object-collection/workspace-item-search-result.model';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core/shared/operators';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { WorkspaceItem } from '@dspace/core/submission/models/workspaceitem.model';
import { BehaviorSubject } from 'rxjs';

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
  imports: [
    AsyncPipe,
    ListableObjectComponentLoaderComponent,
    NgClass,
    ThemedLoadingComponent,
    WorkspaceitemActionsComponent,
  ],
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

getReturnInfo(): { type: 'ADJUSTMENT' | 'REJECTED'; reason: string } | null {
    const derivedResult = this.derivedSearchResult$.value;
    const item: Item = derivedResult?.indexableObject;
    if (!item || !item.metadata) {
      return null;
    }

    // 1. Lê do metadado público dc.description (visível para o depositante comum)
    const descriptions = item.metadata['dc.description'] || [];
    for (let i = descriptions.length - 1; i >= 0; i--) {
      const val = descriptions[i].value || '';
      if (val.startsWith('[DEVOLVIDO_AJUSTE] ')) {
        return {
          type: 'ADJUSTMENT',
          reason: val.replace('[DEVOLVIDO_AJUSTE] ', '').trim(),
        };
      }
      if (val.startsWith('[REJEITADO] ')) {
        return {
          type: 'REJECTED',
          reason: val.replace('[REJEITADO] ', '').trim(),
        };
      }
    }

    // 2. Fallback para dc.description.provenance (caso o usuário logado seja Admin)
    const provenances = item.metadata['dc.description.provenance'] || [];
    for (let i = provenances.length - 1; i >= 0; i--) {
      const value = provenances[i].value || '';
      if (value.includes('Devolvido para ajuste')) {
        const parts = value.split('com o seguinte motivo:');
        return {
          type: 'ADJUSTMENT',
          reason: parts.length > 1 ? parts[1].trim() : value,
        };
      }
      if (value.includes('Rejected by') && value.includes(', reason:')) {
        const parts = value.split(', reason:');
        return {
          type: 'REJECTED',
          reason: parts.length > 1 ? parts[1].trim() : value,
        };
      }
    }

    return null;
  }
}
