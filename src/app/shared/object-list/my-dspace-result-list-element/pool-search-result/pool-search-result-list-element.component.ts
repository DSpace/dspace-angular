import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  Observable,
} from 'rxjs';
import {
  map,
  mergeMap,
  tap,
} from 'rxjs/operators';

import { DSONameService } from '../../../../../../modules/core/src/lib/core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../../../modules/core/src/lib/core/cache/builders/link.service';
import { ObjectCacheService } from '../../../../../../modules/core/src/lib/core/cache/object-cache.service';
import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../../modules/core/src/lib/core/config/app-config.interface';
import { ConfigurationDataService } from '../../../../../../modules/core/src/lib/core/data/configuration-data.service';
import { followLink } from '../../../../../../modules/core/src/lib/core/data/follow-link-config.model';
import { PaginatedList } from '../../../../../../modules/core/src/lib/core/data/paginated-list.model';
import { RemoteData } from '../../../../../../modules/core/src/lib/core/data/remote-data';
import { PoolTaskSearchResult } from '../../../../../../modules/core/src/lib/core/object-collection/pool-task-search-result.model';
import { ConfigurationProperty } from '../../../../../../modules/core/src/lib/core/shared/configuration-property.model';
import { Context } from '../../../../../../modules/core/src/lib/core/shared/context.model';
import { Item } from '../../../../../../modules/core/src/lib/core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../../../../modules/core/src/lib/core/shared/operators';
import { ViewMode } from '../../../../../../modules/core/src/lib/core/shared/view-mode.model';
import { WorkflowItem } from '../../../../../../modules/core/src/lib/core/submission/models/workflowitem.model';
import { SubmissionDuplicateDataService } from '../../../../../../modules/core/src/lib/core/submission/submission-duplicate-data.service';
import { PoolTask } from '../../../../../../modules/core/src/lib/core/tasks/models/pool-task-object.model';
import { PoolTaskActionsComponent } from '../../../mydspace-actions/pool-task/pool-task-actions.component';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { VarDirective } from '../../../utils/var.directive';
import { Duplicate } from '../../duplicate-data/duplicate.model';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';
import { ThemedItemListPreviewComponent } from '../item-list-preview/themed-item-list-preview.component';

/**
 * This component renders pool task object for the search result in the list view.
 */
@Component({
  selector: 'ds-pool-search-result-list-element',
  styleUrls: ['../../search-result-list-element/search-result-list-element.component.scss'],
  templateUrl: './pool-search-result-list-element.component.html',
  standalone: true,
  imports: [ThemedItemListPreviewComponent, NgClass, PoolTaskActionsComponent, AsyncPipe, TranslateModule, VarDirective],
})

@listableObjectComponent(PoolTaskSearchResult, ViewMode.ListElement)
export class PoolSearchResultListElementComponent extends SearchResultListElementComponent<PoolTaskSearchResult, PoolTask>  implements OnInit, OnDestroy {

  /**
   * A boolean representing if to show submitter information
   */
  public showSubmitter = true;

  /**
   * Represents the badge Context
   */
  public badgeContext = Context.MyDSpaceWaitingController;

  /**
   * The item object that belonging to the result object
   */
  public item$: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  /**
   * The workflowitem object that belonging to the result object
   */
  public workflowitem$: BehaviorSubject<WorkflowItem> = new BehaviorSubject<WorkflowItem>(null);

  /**
   * The potential duplicates of this workflow item
   */
  public duplicates$: Observable<Duplicate[]>;

  /**
   * The index of this list element
   */
  public index: number;

  /**
   * Display thumbnails if required by configuration
   */
  showThumbnails: boolean;

  constructor(
    protected linkService: LinkService,
    protected truncatableService: TruncatableService,
    public dsoNameService: DSONameService,
    protected objectCache: ObjectCacheService,
    protected configService: ConfigurationDataService,
    protected duplicateDataService: SubmissionDuplicateDataService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super(truncatableService, dsoNameService, appConfig);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    super.ngOnInit();
    this.linkService.resolveLinks(this.dso, followLink('workflowitem', {},
      followLink('item', {}, followLink('bundles')),
      followLink('submitter'),
    ), followLink('action'));

    (this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((wfiRD: RemoteData<WorkflowItem>) => {
        if (wfiRD.hasSucceeded) {
          this.workflowitem$.next(wfiRD.payload);
          return (wfiRD.payload.item as Observable<RemoteData<Item>>).pipe(
            getFirstCompletedRemoteData(),
          );
        } else {
          return EMPTY;
        }
      }),
      tap((itemRD: RemoteData<Item>) => {
        if (isNotEmpty(itemRD) && itemRD.hasSucceeded) {
          this.item$.next(itemRD.payload);
        }
      }),
    ).subscribe();
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
    // Initialise duplicates, if enabled
    this.duplicates$ = this.initializeDuplicateDetectionIfEnabled();
  }

  /**
   * Initialize and set the duplicates observable based on whether the configuration in REST is enabled
   * and the results returned
   */
  initializeDuplicateDetectionIfEnabled() {
    return combineLatest([
      this.configService.findByPropertyName('duplicate.enable').pipe(
        getFirstCompletedRemoteData(),
        map((remoteData: RemoteData<ConfigurationProperty>) => {
          return (remoteData.isSuccess && remoteData.payload && remoteData.payload.values[0] === 'true');
        }),
      ),
      this.item$.pipe(),
    ],
    ).pipe(
      map(([enabled, rd]) => {
        if (enabled) {
          this.duplicates$ = this.duplicateDataService.findDuplicates(rd.uuid).pipe(
            getFirstCompletedRemoteData(),
            map((remoteData: RemoteData<PaginatedList<Duplicate>>) => {
              if (remoteData.hasSucceeded) {
                if (remoteData.payload.page) {
                  return remoteData.payload.page;
                }
              }
            }),
          );
        } else {
          return [] as Duplicate[];
        }
      }),
    );
  }

  ngOnDestroy() {
    // This ensures the object is removed from cache, when action is performed on task
    if (hasValue(this.dso)) {
      this.objectCache.remove(this.dso._links.workflowitem.href);
    }
  }
}
