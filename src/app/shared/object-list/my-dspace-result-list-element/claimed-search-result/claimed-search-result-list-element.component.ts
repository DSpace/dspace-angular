import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { APP_CONFIG, AppConfig } from '@dspace/config';
import {
  DSONameService,
  LinkService,
  ObjectCacheService,
  ConfigurationDataService,
  PaginatedList,
  RemoteData,
  ConfigurationProperty,
  Context,
  Duplicate,
  followLink,
  Item,
  ClaimedTaskSearchResult,
  getFirstCompletedRemoteData,
  ViewMode,
  WorkflowItem,
  SubmissionDuplicateDataService,
  ClaimedTask,
} from '@dspace/core'
import { hasValue, isNotEmpty } from '@dspace/utils';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import {
  ClaimedTaskActionsComponent,
} from '../../../mydspace-actions/claimed-task/claimed-task-actions.component';
import {
  listableObjectComponent,
} from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { VarDirective } from '../../../utils/var.directive';
import {
  SearchResultListElementComponent,
} from '../../search-result-list-element/search-result-list-element.component';
import {
  ThemedItemListPreviewComponent,
} from '../item-list-preview/themed-item-list-preview.component';

@Component({
  selector: 'ds-claimed-search-result-list-element',
  styleUrls: ['../../search-result-list-element/search-result-list-element.component.scss'],
  templateUrl: './claimed-search-result-list-element.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    ClaimedTaskActionsComponent,
    NgClass,
    ThemedItemListPreviewComponent,
    TranslateModule,
    VarDirective,
  ],
})
@listableObjectComponent(ClaimedTaskSearchResult, ViewMode.ListElement)
export class ClaimedSearchResultListElementComponent extends SearchResultListElementComponent<ClaimedTaskSearchResult, ClaimedTask> implements OnInit, OnDestroy {

  /**
   * A boolean representing if to show submitter information
   */
  public showSubmitter = true;

  /**
   * Represents the badge context
   */
  public badgeContext = Context.MyDSpaceValidation;

  /**
   * The item object that belonging to the result object
   */
  public item$: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  /**
   * The workflowitem object that belonging to the result object
   */
  public workflowitem$: BehaviorSubject<WorkflowItem> = new BehaviorSubject<WorkflowItem>(null);

  /**
   * The potential duplicates of this item
   */
  public duplicates$: Observable<Duplicate[]>;

  /**
   * Display thumbnails if required by configuration
   */
  showThumbnails: boolean;

  public constructor(
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
