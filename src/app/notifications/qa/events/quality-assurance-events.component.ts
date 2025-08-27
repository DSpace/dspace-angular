import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
} from '@angular/router';
import {
  NgbModal,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  from,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  last,
  map,
  mergeMap,
  scan,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import {
  SortDirection,
  SortOptions,
} from '../../../core/cache/models/sort-options.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { QualityAssuranceEventDataService } from '../../../core/notifications/qa/events/quality-assurance-event-data.service';
import {
  QualityAssuranceEventObject,
  SourceQualityAssuranceEventMessageObject,
} from '../../../core/notifications/qa/models/quality-assurance-event.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { Item } from '../../../core/shared/item.model';
import { Metadata } from '../../../core/shared/metadata.utils';
import { NoContent } from '../../../core/shared/NoContent.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { hasValue } from '../../../shared/empty.util';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ItemSearchResult } from '../../../shared/object-collection/shared/item-search-result.model';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import {
  ProjectEntryImportModalComponent,
  QualityAssuranceEventData,
} from '../project-entry-import-modal/project-entry-import-modal.component';
import { EPersonDataComponent } from './ePerson-data/ePerson-data.component';

/**
 * Component to display the Quality Assurance event list.
 */
@Component({
  selector: 'ds-quality-assurance-events',
  templateUrl: './quality-assurance-events.component.html',
  styleUrls: ['./quality-assurance-events.component.scss'],
  standalone: true,
  imports: [
    AlertComponent,
    AsyncPipe,
    BtnDisabledDirective,
    EPersonDataComponent,
    NgbTooltipModule,
    PaginationComponent,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class QualityAssuranceEventsComponent implements OnInit, OnDestroy {
  /**
   * The pagination system configuration for HTML listing.
   * @type {PaginationComponentOptions}
   */
  public paginationConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'bep',
    currentPage: 1,
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 40, 60],
  });
  /**
   * The Quality Assurance event list sort options.
   * @type {SortOptions}
   */
  public paginationSortConfig: SortOptions = new SortOptions('trust', SortDirection.DESC);
  /**
   * Array to save the presence of a project inside an Quality Assurance event.
   * @type {QualityAssuranceEventData[]>}
   */
  public eventsUpdated$: BehaviorSubject<QualityAssuranceEventData[]> = new BehaviorSubject([]);
  /**
   * The total number of Quality Assurance events.
   * @type {Observable<number>}
   */
  public totalElements$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  /**
   * The topic of the Quality Assurance events; suitable for displaying.
   * @type {string}
   */
  public showTopic: string;
  /**
   * The topic of the Quality Assurance events; suitable for HTTP calls.
   * @type {string}
   */
  public topic: string;
  /**
   * The sourceId of the Quality Assurance events.
   * @type {string}
   */
  sourceId: string;
  /**
   * The rejected/ignore reason.
   * @type {string}
   */
  public selectedReason: string;
  /**
   * Contains the information about the loading status of the page.
   * @type {Observable<boolean>}
   */
  public isEventPageLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The modal reference.
   * @type {any}
   */
  public modalRef: any;
  /**
   * Used to store the status of the 'Show more' button of the abstracts.
   * @type {boolean}
   */
  public showMore = false;
  /**
   * The quality assurance source base url for project search
   */
  public sourceUrlForProjectSearch: string;
  /**
   * The FindListOptions object
   */
  protected defaultConfig: FindListOptions = Object.assign(new FindListOptions(), { sort: this.paginationSortConfig });
  /**
   * Array to track all the component subscriptions. Useful to unsubscribe them with 'onDestroy'.
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * The target item id, retrieved from the topic-id composition.
   */
  public targetId: string;

  /**
   * The URL of the item page/target.
   */
  public itemPageUrl: string;

  /**
   * Plain topic name (without the source id)
   */
  public selectedTopicName: string;


  /**
   * Observable that emits a boolean value indicating whether the user is an admin.
   */
  isAdmin$: Observable<boolean>;

  /**
   * Initialize the component variables.
   * @param {ActivatedRoute} activatedRoute
   * @param {NgbModal} modalService
   * @param {NotificationsService} notificationsService
   * @param {QualityAssuranceEventDataService} qualityAssuranceEventRestService
   * @param {PaginationService} paginationService
   * @param {TranslateService} translateService
   * @param authorizationService
   * @param itemService
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private notificationsService: NotificationsService,
    private qualityAssuranceEventRestService: QualityAssuranceEventDataService,
    private paginationService: PaginationService,
    private translateService: TranslateService,
    private authorizationService: AuthorizationDataService,
    private itemService: ItemDataService,
  ) {
  }

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.isEventPageLoading.next(true);
    this.isAdmin$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
    this.activatedRoute.paramMap.pipe(
      tap((params) => {
        this.sourceUrlForProjectSearch = environment.qualityAssuranceConfig.sourceUrlMapForProjectSearch[params.get('sourceId')];
        this.sourceId = params.get('sourceId');
      }),
      map((params) => params.get('topicId')),
      take(1),
      switchMap((id: string) => {
        const regEx = /!/g;
        this.showTopic = id.replace(regEx, '/');
        this.topic = id;
        const splitList = this.showTopic?.split(':');
        this.targetId = splitList.length > 2 ? splitList.pop() : null;
        this.selectedTopicName = splitList[1];
        this.sourceId = splitList[0];
        return this.getQualityAssuranceEvents();
      }),
    ).subscribe(
      {
        next: (events: QualityAssuranceEventData[]) => {
          this.eventsUpdated$.next(events);
          this.isEventPageLoading.next(false);
        },
        error: (error: unknown) => {
          this.isEventPageLoading.next(false);
        },
      },
    );
  }

  /**
   * Check if table have a detail column
   */
  public hasDetailColumn(): boolean {
    return (this.showTopic.indexOf('/PROJECT') !== -1 ||
      this.showTopic.indexOf('/PID') !== -1 ||
      this.showTopic.indexOf('/SUBJECT') !== -1 ||
      this.showTopic.indexOf('/WITHDRAWN') !== -1 ||
      this.showTopic.indexOf('/REINSTATE') !== -1 ||
      this.showTopic.indexOf('/ABSTRACT') !== -1
    );
  }

  /**
   * Checks if the current topic is related to a reinstate or withdrawn request.
   */
  public get isReinstateWithdrawnRequest(): boolean {
    return this.showTopic.indexOf('/WITHDRAWN') !== -1 || this.showTopic.indexOf('/REINSTATE') !== -1;
  }

  /**
   * Open a modal or run the executeAction directly based on the presence of the project.
   *
   * @param {string} action
   *    the action (can be: ACCEPTED, REJECTED, DISCARDED, PENDING)
   * @param {QualityAssuranceEventData} eventData
   *    the Quality Assurance event data
   * @param {any} content
   *    Reference to the modal
   */
  public modalChoice(action: string, eventData: QualityAssuranceEventData, content: any): void {
    if (eventData.hasProject) {
      this.executeAction(action, eventData);
    } else {
      this.openModal(action, eventData, content);
    }
  }

  /**
   * Open the selected modal and performs the action if needed.
   *
   * @param {string} action
   *    the action (can be: ACCEPTED, REJECTED, DISCARDED, PENDING)
   * @param {QualityAssuranceEventData} eventData
   *    the Quality Assurance event data
   * @param {any} content
   *    Reference to the modal
   */
  public openModal(action: string, eventData: QualityAssuranceEventData, content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        if (result === 'do') {
          eventData.reason = this.selectedReason;
          this.executeAction(action, eventData);
        }
        this.selectedReason = null;
      },
      (_reason) => {
        this.selectedReason = null;
      },
    );
  }

  /**
   * Open a modal where the user can select the project.
   *
   * @param {QualityAssuranceEventData} eventData
   *    the Quality Assurance event item data
   */
  public openModalLookup(eventData: QualityAssuranceEventData): void {
    this.modalRef = this.modalService.open(ProjectEntryImportModalComponent, {
      size: 'lg',
    });
    const modalComp = this.modalRef.componentInstance;
    modalComp.externalSourceEntry = eventData;
    modalComp.label = 'project';
    this.subs.push(
      modalComp.importedObject.pipe(take(1))
        .subscribe((object: ItemSearchResult) => {
          const projectTitle = Metadata.first(object.indexableObject.metadata, 'dc.title');
          this.boundProject(
            eventData,
            object.indexableObject.id,
            projectTitle.value,
            object.indexableObject.handle,
          );
        }),
    );
  }

  /**
   * Performs the chosen action calling the REST service.
   *
   * @param {string} action
   *    the action (can be: ACCEPTED, REJECTED, DISCARDED, PENDING)
   * @param {QualityAssuranceEventData} eventData
   *    the Quality Assurance event data
   */
  public executeAction(action: string, eventData: QualityAssuranceEventData): void {
    eventData.isRunning = true;
    let operation;
    if (action === 'UNDO') {
      operation = this.delete(eventData);
    } else {
      operation = this.qualityAssuranceEventRestService.patchEvent(action, eventData.event, eventData.reason);
    }
    this.subs.push(
      operation.pipe(
        getFirstCompletedRemoteData(),
        switchMap((rd: RemoteData<QualityAssuranceEventObject>) => {
          if (rd.hasSucceeded) {
            this.notificationsService.success(
              this.translateService.instant('quality-assurance.event.action.saved'),
            );
            return this.getQualityAssuranceEvents();
          } else {
            this.notificationsService.error(
              this.translateService.instant('quality-assurance.event.action.error'),
            );
            return of(this.eventsUpdated$.value);
          }
        }),
      ).subscribe((events: QualityAssuranceEventData[]) => {
        this.eventsUpdated$.next(events);
        eventData.isRunning = false;
      }),
    );
  }

  /**
   * Bound a project to the publication described in the Quality Assurance event calling the REST service.
   *
   * @param {QualityAssuranceEventData} eventData
   *    the Quality Assurance event item data
   * @param {string} projectId
   *    the project Id to bound
   * @param {string} projectTitle
   *    the project title
   * @param {string} projectHandle
   *    the project handle
   */
  public boundProject(eventData: QualityAssuranceEventData, projectId: string, projectTitle: string, projectHandle: string): void {
    eventData.isRunning = true;
    this.subs.push(
      this.qualityAssuranceEventRestService.boundProject(eventData.id, projectId).pipe(getFirstCompletedRemoteData())
        .subscribe((rd: RemoteData<QualityAssuranceEventObject>) => {
          if (rd.hasSucceeded) {
            this.notificationsService.success(
              this.translateService.instant('quality-assurance.event.project.bounded'),
            );
            eventData.hasProject = true;
            eventData.projectTitle = projectTitle;
            eventData.handle = projectHandle;
            eventData.projectId = projectId;
          } else {
            this.notificationsService.error(
              this.translateService.instant('quality-assurance.event.project.error'),
            );
          }
          eventData.isRunning = false;
        }),
    );
  }

  /**
   * Remove the bounded project from the publication described in the Quality Assurance event calling the REST service.
   *
   * @param {QualityAssuranceEventData} eventData
   *    the Quality Assurance event data
   */
  public removeProject(eventData: QualityAssuranceEventData): void {
    eventData.isRunning = true;
    this.subs.push(
      this.qualityAssuranceEventRestService.removeProject(eventData.id).pipe(getFirstCompletedRemoteData())
        .subscribe((rd: RemoteData<QualityAssuranceEventObject>) => {
          if (rd.hasSucceeded) {
            this.notificationsService.success(
              this.translateService.instant('quality-assurance.event.project.removed'),
            );
            eventData.hasProject = false;
            eventData.projectTitle = null;
            eventData.handle = null;
            eventData.projectId = null;
          } else {
            this.notificationsService.error(
              this.translateService.instant('quality-assurance.event.project.error'),
            );
          }
          eventData.isRunning = false;
        }),
    );
  }

  /**
   * Check if the event has a valid href.
   * @param event
   */
  public hasPIDHref(event: SourceQualityAssuranceEventMessageObject): boolean {
    return this.getPIDHref(event) !== null;
  }

  /**
   * Get the event pid href.
   * @param event
   */
  public getPIDHref(event: SourceQualityAssuranceEventMessageObject): string {
    return event.pidHref;
  }

  /**
   * Dispatch the Quality Assurance events retrieval.
   */
  public getQualityAssuranceEvents(): Observable<QualityAssuranceEventData[]> {
    return this.paginationService.getFindListOptions(this.paginationConfig.id, this.defaultConfig).pipe(
      distinctUntilChanged(),
      switchMap((options: FindListOptions) => this.qualityAssuranceEventRestService.getEventsByTopic(
        this.topic,
        options,
        followLink('target'), followLink('related'),
      )),
      getFirstCompletedRemoteData(),
      switchMap((rd: RemoteData<PaginatedList<QualityAssuranceEventObject>>) => {
        if (rd.hasSucceeded) {
          this.totalElements$.next(rd.payload.totalElements);
          if (rd.payload?.page?.length > 0) {
            return this.fetchEvents(rd.payload.page);
          } else {
            return of([]);
          }
        } else {
          throw new Error('Can\'t retrieve Quality Assurance events from the Broker events REST service');
        }
      }),
      take(1),
      tap(() => {
        this.qualityAssuranceEventRestService.clearFindByTopicRequests();
      }),
    );
  }

  /**
   * Unsubscribe from all subscriptions.
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  /**
   * Fetch Quality Assurance events in order to build proper QualityAssuranceEventData object.
   *
   * @param {QualityAssuranceEventObject[]} events
   *    the Quality Assurance event item
   * @return array of QualityAssuranceEventData
   */
  protected fetchEvents(events: QualityAssuranceEventObject[]): Observable<QualityAssuranceEventData[]> {
    return from(events).pipe(
      mergeMap((event: QualityAssuranceEventObject) => {
        const related$ = event.related.pipe(
          getFirstCompletedRemoteData(),
        );
        const target$ = event.target.pipe(
          getFirstCompletedRemoteData(),
        );
        return combineLatest([related$, target$]).pipe(
          map(([relatedItemRD, targetItemRD]: [RemoteData<Item>, RemoteData<Item>]) => {
            const data: QualityAssuranceEventData = {
              event: event,
              id: event.id,
              title: event.title,
              hasProject: false,
              projectTitle: null,
              projectId: null,
              handle: null,
              reason: null,
              isRunning: false,
              target: (targetItemRD?.hasSucceeded) ? targetItemRD.payload : null,
            };
            if (relatedItemRD?.hasSucceeded && relatedItemRD?.payload?.id) {
              data.hasProject = true;
              data.projectTitle = event.message.title;
              data.projectId = relatedItemRD?.payload?.id;
              data.handle = relatedItemRD?.payload?.handle;
            }
            return data;
          }),
        );
      }),
      scan((acc: any, value: any) => [...acc, value], []),
      last(),
    );
  }

  /**
   * Deletes a quality assurance event.
   * @param qaEvent The quality assurance event to delete.
   * @returns An Observable of RemoteData containing NoContent.
   */
  delete(qaEvent: QualityAssuranceEventData): Observable<RemoteData<NoContent>> {
    return this.qualityAssuranceEventRestService.deleteQAEvent(qaEvent);
  }

  /**
   * Returns an Observable that emits the title of the target item.
   * The target item is retrieved by its ID using the itemService.
   * The title is extracted from the first metadata value of the item.
   * The item page URL is also set in the component.
   * @returns An Observable that emits the title of the target item.
   */
  public getTargetItemTitle(): Observable<string> {
    return this.itemService.findById(this.targetId).pipe(
      take(1),
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      tap((item: Item) => this.itemPageUrl = getItemPageRoute(item)),
      map((item: Item) => item.firstMetadataValue('dc.title')),
    );
  }
}
