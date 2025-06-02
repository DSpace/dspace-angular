import {
  AsyncPipe,
  NgClass,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
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

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../config/app-config.interface';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { ConfigurationDataService } from '../../../../core/data/configuration-data.service';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { ConfigurationProperty } from '../../../../core/shared/configuration-property.model';
import { Context } from '../../../../core/shared/context.model';
import { Item } from '../../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { SubmissionDuplicateDataService } from '../../../../core/submission/submission-duplicate-data.service';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import {
  hasValue,
  isNotEmpty,
} from '../../../empty.util';
import { ClaimedTaskActionsComponent } from '../../../mydspace-actions/claimed-task/claimed-task-actions.component';
import { ClaimedTaskSearchResult } from '../../../object-collection/shared/claimed-task-search-result.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { followLink } from '../../../utils/follow-link-config.model';
import { VarDirective } from '../../../utils/var.directive';
import { Duplicate } from '../../duplicate-data/duplicate.model';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';
import { ThemedItemListPreviewComponent } from '../item-list-preview/themed-item-list-preview.component';

@Component({
  selector: 'ds-claimed-search-result-list-element',
  styleUrls: ['../../search-result-list-element/search-result-list-element.component.scss'],
  templateUrl: './claimed-search-result-list-element.component.html',
  standalone: true,
  imports: [NgIf, ThemedItemListPreviewComponent, NgClass, ClaimedTaskActionsComponent, AsyncPipe, TranslateModule, VarDirective],
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
