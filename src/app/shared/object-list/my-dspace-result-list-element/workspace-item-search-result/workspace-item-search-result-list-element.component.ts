import { Component, Inject } from '@angular/core';

import { Observable } from 'rxjs';
import { find, map } from 'rxjs/operators';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { Item } from '../../../../core/shared/item.model';

import { ViewMode } from '../../../../core/shared/view-mode.model';
import { WorkspaceItem } from '../../../../core/submission/models/workspaceitem.model';
import { isNotUndefined } from '../../../empty.util';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { WorkspaceItemSearchResult } from '../../../object-collection/shared/workspace-item-search-result.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { followLink } from '../../../utils/follow-link-config.model';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { APP_CONFIG, AppConfig } from '../../../../../config/app-config.interface';

/**
 * This component renders workspaceitem object for the search result in the list view.
 */
@Component({
  selector: 'ds-workspace-item-search-result-list-element',
  styleUrls: ['../../search-result-list-element/search-result-list-element.component.scss', './workspace-item-search-result-list-element.component.scss'],
  templateUrl: './workspace-item-search-result-list-element.component.html',
})

@listableObjectComponent(WorkspaceItemSearchResult, ViewMode.ListElement)
export class WorkspaceItemSearchResultListElementComponent extends SearchResultListElementComponent<WorkspaceItemSearchResult, WorkspaceItem> {

  /**
   * The item object that belonging to the result object
   */
  item$: Observable<Item>;

  /**
   * Represent item's status
   */
  status = MyDspaceItemStatusType.WORKSPACE;

  /**
   * Display thumbnails if required by configuration
   */
  showThumbnails: boolean;

  constructor(
    protected truncatableService: TruncatableService,
    protected linkService: LinkService,
    protected dsoNameService: DSONameService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {
    super(truncatableService, dsoNameService, appConfig);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    super.ngOnInit();
    this.linkService.resolveLink(this.dso, followLink('item'));
    this.initItem(this.dso.item as Observable<RemoteData<Item>>);
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
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
