import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, from, Observable, of as observableOf, Subscription } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, scan, switchMap, take } from 'rxjs/operators';

import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { FindListOptions } from '../../../core/data/request.models';
import {
  NotificationsBrokerEventObject,
  OpenaireBrokerEventMessageObject
} from '../../../core/notifications/broker/models/notifications-broker-event.model';
import { NotificationsBrokerEventRestService } from '../../../core/notifications/broker/events/notifications-broker-event-rest.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { Metadata } from '../../../core/shared/metadata.utils';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { hasValue } from '../../../shared/empty.util';
import { ItemSearchResult } from '../../../shared/object-collection/shared/item-search-result.model';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  NotificationsBrokerEventData,
  ProjectEntryImportModalComponent
} from '../project-entry-import-modal/project-entry-import-modal.component';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Item } from '../../../core/shared/item.model';

/**
 * Component to display the Notifications Broker event list.
 */
@Component({
  selector: 'ds-notifications-broker-events',
  templateUrl: './notifications-broker-events.component.html',
  styleUrls: ['./notifications-broker-events.scomponent.scss'],
})
export class NotificationsBrokerEventsComponent implements OnInit {
  /**
   * The pagination system configuration for HTML listing.
   * @type {PaginationComponentOptions}
   */
  public paginationConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'bep',
    currentPage: 1,
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 40, 60]
  });
  /**
   * The Notifications Broker event list sort options.
   * @type {SortOptions}
   */
  public paginationSortConfig: SortOptions = new SortOptions('trust', SortDirection.DESC);
  /**
   * Array to save the presence of a project inside an Notifications Broker event.
   * @type {NotificationsBrokerEventData[]>}
   */
  public eventsUpdated$: BehaviorSubject<NotificationsBrokerEventData[]> = new BehaviorSubject([]);
  /**
   * The total number of Notifications Broker events.
   * @type {Observable<number>}
   */
  public totalElements$: Observable<number>;
  /**
   * The topic of the Notifications Broker events; suitable for displaying.
   * @type {string}
   */
  public showTopic: string;
  /**
   * The topic of the Notifications Broker events; suitable for HTTP calls.
   * @type {string}
   */
  public topic: string;
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
   * Contains the information about the loading status of the events inside the pagination component.
   * @type {Observable<boolean>}
   */
  public isEventLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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
   * The FindListOptions object
   */
  protected defaultConfig: FindListOptions = Object.assign(new FindListOptions(), {sort: this.paginationSortConfig});
  /**
   * Array to track all the component subscriptions. Useful to unsubscribe them with 'onDestroy'.
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * Initialize the component variables.
   * @param {ActivatedRoute} activatedRoute
   * @param {NgbModal} modalService
   * @param {NotificationsService} notificationsService
   * @param {NotificationsBrokerEventRestService} notificationsBrokerEventRestService
   * @param {PaginationService} paginationService
   * @param {TranslateService} translateService
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private notificationsService: NotificationsService,
    private notificationsBrokerEventRestService: NotificationsBrokerEventRestService,
    private paginationService: PaginationService,
    private translateService: TranslateService
  ) {
  }

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.isEventPageLoading.next(true);

    this.activatedRoute.paramMap.pipe(
      map((params) => params.get('id')),
      take(1)
    ).subscribe((id: string) => {
      const regEx = /!/g;
      this.showTopic = id.replace(regEx, '/');
      this.topic = id;
      this.isEventPageLoading.next(false);
      this.getNotificationsBrokerEvents();
    });
  }

  /**
   * Check if table have a detail column
   */
  public hasDetailColumn(): boolean {
    return (this.showTopic.indexOf('/PROJECT') !== -1 ||
      this.showTopic.indexOf('/PID') !== -1 ||
      this.showTopic.indexOf('/SUBJECT') !== -1 ||
      this.showTopic.indexOf('/ABSTRACT') !== -1
    );
  }

  /**
   * Open a modal or run the executeAction directly based on the presence of the project.
   *
   * @param {string} action
   *    the action (can be: ACCEPTED, REJECTED, DISCARDED, PENDING)
   * @param {NotificationsBrokerEventData} eventData
   *    the Notifications Broker event data
   * @param {any} content
   *    Reference to the modal
   */
  public modalChoice(action: string, eventData: NotificationsBrokerEventData, content: any): void {
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
   * @param {NotificationsBrokerEventData} eventData
   *    the Notifications Broker event data
   * @param {any} content
   *    Reference to the modal
   */
  public openModal(action: string, eventData: NotificationsBrokerEventData, content: any): void {
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
      }
    );
  }

  /**
   * Open a modal where the user can select the project.
   *
   * @param {NotificationsBrokerEventData} eventData
   *    the Notifications Broker event item data
   */
  public openModalLookup(eventData: NotificationsBrokerEventData): void {
    this.modalRef = this.modalService.open(ProjectEntryImportModalComponent, {
      size: 'lg'
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
            object.indexableObject.handle
          );
        })
    );
  }

  /**
   * Performs the choosen action calling the REST service.
   *
   * @param {string} action
   *    the action (can be: ACCEPTED, REJECTED, DISCARDED, PENDING)
   * @param {NotificationsBrokerEventData} eventData
   *    the Notifications Broker event data
   */
  public executeAction(action: string, eventData: NotificationsBrokerEventData): void {
    eventData.isRunning = true;
    this.subs.push(
      this.notificationsBrokerEventRestService.patchEvent(action, eventData.event, eventData.reason).pipe(getFirstCompletedRemoteData())
        .subscribe((rd: RemoteData<NotificationsBrokerEventObject>) => {
          if (rd.isSuccess && rd.statusCode === 200) {
            this.notificationsService.success(
              this.translateService.instant('notifications.broker.event.action.saved')
            );
            this.getNotificationsBrokerEvents();
          } else {
            this.notificationsService.error(
              this.translateService.instant('notifications.broker.event.action.error')
            );
          }
          eventData.isRunning = false;
        })
    );
  }

  /**
   * Bound a project to the publication described in the Notifications Broker event calling the REST service.
   *
   * @param {NotificationsBrokerEventData} eventData
   *    the Notifications Broker event item data
   * @param {string} projectId
   *    the project Id to bound
   * @param {string} projectTitle
   *    the project title
   * @param {string} projectHandle
   *    the project handle
   */
  public boundProject(eventData: NotificationsBrokerEventData, projectId: string, projectTitle: string, projectHandle: string): void {
    eventData.isRunning = true;
    this.subs.push(
      this.notificationsBrokerEventRestService.boundProject(eventData.id, projectId).pipe(getFirstCompletedRemoteData())
        .subscribe((rd: RemoteData<NotificationsBrokerEventObject>) => {
          if (rd.isSuccess) {
            this.notificationsService.success(
              this.translateService.instant('notifications.broker.event.project.bounded')
            );
            eventData.hasProject = true;
            eventData.projectTitle = projectTitle;
            eventData.handle = projectHandle;
            eventData.projectId = projectId;
          } else {
            this.notificationsService.error(
              this.translateService.instant('notifications.broker.event.project.error')
            );
          }
          eventData.isRunning = false;
        })
    );
  }

  /**
   * Remove the bounded project from the publication described in the Notifications Broker event calling the REST service.
   *
   * @param {NotificationsBrokerEventData} eventData
   *    the Notifications Broker event data
   */
  public removeProject(eventData: NotificationsBrokerEventData): void {
    eventData.isRunning = true;
    this.subs.push(
      this.notificationsBrokerEventRestService.removeProject(eventData.id).pipe(getFirstCompletedRemoteData())
        .subscribe((rd: RemoteData<NotificationsBrokerEventObject>) => {
          if (rd.isSuccess) {
            this.notificationsService.success(
              this.translateService.instant('notifications.broker.event.project.removed')
            );
            eventData.hasProject = false;
            eventData.projectTitle = null;
            eventData.handle = null;
            eventData.projectId = null;
          } else {
            this.notificationsService.error(
              this.translateService.instant('notifications.broker.event.project.error')
            );
          }
          eventData.isRunning = false;
        })
    );
  }

  /**
   * Check if the event has a valid href.
   * @param event
   */
  public hasPIDHref(event: OpenaireBrokerEventMessageObject): boolean {
    return this.getPIDHref(event) !== null;
  }

  /**
   * Get the event pid href.
   * @param event
   */
  public getPIDHref(event: OpenaireBrokerEventMessageObject): string {
    return this.computePIDHref(event);
  }


  /**
   * Dispatch the Notifications Broker events retrival.
   */
  public getNotificationsBrokerEvents(): void {
    this.paginationService.getFindListOptions(this.paginationConfig.id, this.defaultConfig).pipe(
      distinctUntilChanged(),
      switchMap((options: FindListOptions) => this.notificationsBrokerEventRestService.getEventsByTopic(
        this.topic,
        options,
        followLink('target'), followLink('related')
      )),
      getFirstCompletedRemoteData(),
    ).subscribe((rd: RemoteData<PaginatedList<NotificationsBrokerEventObject>>) => {
      if (rd.hasSucceeded) {
        this.isEventLoading.next(false);
        this.totalElements$ = observableOf(rd.payload.totalElements);
        this.setEventUpdated(rd.payload.page);
      } else {
        throw new Error('Can\'t retrieve Notifications Broker events from the Broker events REST service');
      }
      this.notificationsBrokerEventRestService.clearFindByTopicRequests();
    });
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
   * Set the project status for the Notifications Broker events.
   *
   * @param {NotificationsBrokerEventObject[]} events
   *    the Notifications Broker event item
   */
  protected setEventUpdated(events: NotificationsBrokerEventObject[]): void {
    this.subs.push(
      from(events).pipe(
        mergeMap((event: NotificationsBrokerEventObject) => {
          const related$ = event.related.pipe(
            getFirstCompletedRemoteData(),
          );
          const target$ = event.target.pipe(
            getFirstCompletedRemoteData()
          );
          return combineLatest([related$, target$]).pipe(
            map(([relatedItemRD, targetItemRD]: [RemoteData<Item>, RemoteData<Item>]) => {
              const data: NotificationsBrokerEventData = {
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
            })
          );
        }),
        scan((acc: any, value: any) => [...acc, value], []),
        take(events.length)
      ).subscribe(
        (eventsReduced) => {
          this.eventsUpdated$.next(eventsReduced);
        }
      )
    );
  }

  protected computePIDHref(event: OpenaireBrokerEventMessageObject) {
    const type = event.type.toLowerCase();
    const pid = event.value;
    let prefix = null;
    switch (type) {
      case 'arxiv': {
        prefix = 'https://arxiv.org/abs/';
        break;
      }
      case 'handle': {
        prefix = 'https://hdl.handle.net/';
        break;
      }
      case 'urn': {
        prefix = '';
        break;
      }
      case 'doi': {
        prefix = 'https://doi.org/';
        break;
      }
      case 'pmc': {
        prefix = 'https://www.ncbi.nlm.nih.gov/pmc/articles/';
        break;
      }
      case 'pmid': {
        prefix = 'https://pubmed.ncbi.nlm.nih.gov/';
        break;
      }
      case 'ncid': {
        prefix = 'https://ci.nii.ac.jp/ncid/';
        break;
      }
      default: {
        break;
      }
    }
    if (prefix === null) {
      return null;
    }
    return prefix + pid;
  }
}
