import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, from, Observable, of as observableOf, Subscription } from 'rxjs';
import { filter, flatMap, map, scan, take } from 'rxjs/operators';

import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../../core/data/paginated-list';
import { RemoteData } from '../../../core/data/remote-data';
import { FindListOptions } from '../../../core/data/request.models';
import { OpenaireBrokerEventObject } from '../../../core/openaire/broker/models/openaire-broker-event.model';
import { OpenaireBrokerEventRestService } from '../../../core/openaire/broker/events/openaire-broker-event-rest.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { Metadata } from '../../../core/shared/metadata.utils';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { ItemSearchResult } from '../../../shared/object-collection/shared/item-search-result.model';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { RestResponse } from '../../../core/cache/response.models';
import {
  OpenaireBrokerEventData,
  ProjectEntryImportModalComponent
} from '../project-entry-import-modal/project-entry-import-modal.component';
import { getFinishedRemoteData, getRemoteDataPayload } from '../../../core/shared/operators';
import { Item } from '../../../core/shared/item.model';
import { AdminNotificationsOpenaireEventsPageParams } from '../../../+admin/admin-notifications/admin-notifications-openaire-events-page/admin-notifications-openaire-events-page.resolver';

/**
 * Component to display the OpenAIRE Broker event list.
 */
@Component({
  selector: 'ds-openaire-broker-events',
  templateUrl: './openaire-broker-events.component.html',
  styleUrls: ['./openaire-broker-events.scomponent.scss'],
})
export class OpenaireBrokerEventsComponent implements OnInit {
  /**
   * The number of OpenAIRE Broker events per page.
   */
  public elementsPerPage = 10;
  /**
   * The pagination system configuration for HTML listing.
   * @type {PaginationComponentOptions}
   */
  public paginationConfig: PaginationComponentOptions;
  /**
   * The OpenAIRE Broker event list sort options.
   * @type {SortOptions}
   */
  public paginationSortConfig: SortOptions;
  /**
   * Array to save the presence of a project inside an OpenAIRE Broker event.
   * @type {OpenaireBrokerEventData[]>}
   */
  public eventsUpdated$: BehaviorSubject<OpenaireBrokerEventData[]> = new BehaviorSubject([]);
  /**
   * The total number of OpenAIRE Broker events.
   * @type {Observable<number>}
   */
  public totalElements$: Observable<number>;
  /**
   * The topic of the OpenAIRE Broker events; suitable for displaying.
   * @type {string}
   */
  public showTopic: string;
  /**
   * The topic of the OpenAIRE Broker events; suitable for HTTP calls.
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
   * Array to track all the component subscriptions. Useful to unsubscribe them with 'onDestroy'.
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * Initialize the component variables.
   * @param {ActivatedRoute} activatedRoute
   * @param {OpenaireBrokerEventRestService} openaireBrokerEventRestService
   * @param {NgbModal} modalService
   * @param {NotificationsService} notificationsService
   * @param {TranslateService} translateService
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private openaireBrokerEventRestService: OpenaireBrokerEventRestService,
    private modalService: NgbModal,
    private notificationsService: NotificationsService,
    private translateService: TranslateService
  ) { }

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.isEventPageLoading.next(true)
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = 'openaire_broker_events';
    this.paginationConfig.pageSize = this.elementsPerPage;
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.pageSizeOptions = [ 5, 10, 20, 30, 50 ];

    this.subs.push(
      combineLatest(
        this.activatedRoute.paramMap.pipe(
          map((params) => params.get('id'))
        ),
        this.activatedRoute.data.pipe(
          map((data) => data.openaireBrokerEventsParams)
        )
      )
      .subscribe(([id, openaireBrokerEventsRouteParams]: [string, any]) => {
        this.updatePaginationFromRouteParams(openaireBrokerEventsRouteParams)
        const regEx = /!/g;
        this.showTopic = id.replace(regEx, '/');
        this.topic = id;
        this.isEventPageLoading.next(false);
        this.getOpenaireBrokerEvents();
      })
    );
  }

  /**
   * Set the current page for the pagination system.
   *
   * @param {number} page
   *    the number of the current page
   */
  public setPage(page: number) {
    if (this.paginationConfig.currentPage !== page) {
      this.paginationConfig.currentPage = page;
      this.getOpenaireBrokerEvents();
    }
  }

  /**
   * Check if table have a detail column
   */
  public hasDetailColumn(): boolean {
    return (this.showTopic.indexOf('/PROJECT') !== -1 ||
      this.showTopic.indexOf('/PID') !== -1 ||
      this.showTopic.indexOf('/SUBJECT') !== -1 ||
      this.showTopic.indexOf('/ABSTRACT') !== -1
    )
  }

  /**
   * Open a modal or run the executeAction directly based on the presence of the project.
   *
   * @param {string} action
   *    the action (can be: ACCEPTED, REJECTED, DISCARDED, PENDING)
   * @param {OpenaireBrokerEventData} eventData
   *    the OpenAIRE Broker event data
   * @param {any} content
   *    Reference to the modal
   */
  public modalChoice(action: string, eventData: OpenaireBrokerEventData, content: any): void {
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
   * @param {OpenaireBrokerEventData} eventData
   *    the OpenAIRE Broker event data
   * @param {any} content
   *    Reference to the modal
   */
  public openModal(action: string, eventData: OpenaireBrokerEventData, content: any): void {
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
   * @param {OpenaireBrokerEventData} eventData
   *    the OpenAIRE Broker event item data
   */
  public openModalLookup(eventData: OpenaireBrokerEventData): void {
    this.modalRef = this.modalService.open(ProjectEntryImportModalComponent, {
      size: 'lg'
    });
    const modalComp = this.modalRef.componentInstance;
    modalComp.externalSourceEntry = eventData;
    modalComp.label = 'project';
    this.subs.push(
      modalComp.importedObject.subscribe((object: ItemSearchResult) => {
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
   * @param {OpenaireBrokerEventData} eventData
   *    the OpenAIRE Broker event data
   */
  public executeAction(action: string, eventData: OpenaireBrokerEventData): void {
    eventData.isRunning = true;
    this.subs.push(
      this.openaireBrokerEventRestService.patchEvent(action, eventData.event, eventData.reason).pipe(take(1))
        .subscribe((rd: RestResponse) => {
          if (rd.isSuccessful && rd.statusCode === 200) {
            this.notificationsService.success(
              this.translateService.instant('openaire.broker.event.action.saved')
            );
            this.getOpenaireBrokerEvents();
          } else {
            this.notificationsService.error(
              this.translateService.instant('openaire.broker.event.action.error')
            );
          }
          eventData.isRunning = false;
        })
    );
  }

  /**
   * Bound a project to the publication described in the OpenAIRE Broker event calling the REST service.
   *
   * @param {OpenaireBrokerEventData} eventData
   *    the OpenAIRE Broker event item data
   * @param {string} projectId
   *    the project Id to bound
   * @param {string} projectTitle
   *    the project title
   * @param {string} projectHandle
   *    the project handle
   */
  public boundProject(eventData: OpenaireBrokerEventData, projectId: string, projectTitle: string, projectHandle: string): void {
    eventData.isRunning = true;
    this.subs.push(
      this.openaireBrokerEventRestService.boundProject(eventData.id, projectId).pipe(
        map((rd: RestResponse) => {
          if (rd.isSuccessful && rd.statusCode === 201) {
            this.notificationsService.success(
              this.translateService.instant('openaire.broker.event.project.bounded')
            );
            eventData.hasProject = true;
            eventData.projectTitle = projectTitle;
            eventData.handle = projectHandle;
            eventData.projectId = projectId;
          } else {
            this.notificationsService.error(
              this.translateService.instant('openaire.broker.event.project.error')
            );
          }
          eventData.isRunning = false;
        })
      )
      .subscribe()
    );
  }

  /**
   * Remove the bounded project from the publication described in the OpenAIRE Broker event calling the REST service.
   *
   * @param {OpenaireBrokerEventData} eventData
   *    the OpenAIRE Broker event data
   */
  public removeProject(eventData: OpenaireBrokerEventData): void {
    eventData.isRunning = true;
    this.subs.push(
      this.openaireBrokerEventRestService.removeProject(eventData.id).pipe(
        map((rd: RestResponse) => {
          if (rd.isSuccessful && rd.statusCode === 204) {
            this.notificationsService.success(
              this.translateService.instant('openaire.broker.event.project.removed')
            );
            eventData.hasProject = false;
            eventData.projectTitle = null;
            eventData.handle = null;
            eventData.projectId = null;
          } else {
            this.notificationsService.error(
              this.translateService.instant('openaire.broker.event.project.error')
            );
          }
          eventData.isRunning = false;
        })
      )
      .subscribe()
    );
  }

  /**
   * Dispatch the OpenAIRE Broker events retrival.
   */
  protected getOpenaireBrokerEvents(): void {
    this.isEventLoading.next(true)
    this.eventsUpdated$ = new BehaviorSubject([]);
    const options: FindListOptions = {
      elementsPerPage: this.paginationConfig.pageSize,
      currentPage: this.paginationConfig.currentPage,
    };
    this.subs.push(
      this.openaireBrokerEventRestService.getEventsByTopic(
        this.topic,
        options,
        followLink('target'),followLink('related')
      ).pipe(
        getFinishedRemoteData(),
        take(1)
      ).subscribe((rd: RemoteData<PaginatedList<OpenaireBrokerEventObject>>) => {
        if (rd.hasSucceeded) {
          this.isEventLoading.next(false)
          this.totalElements$ = observableOf(rd.payload.totalElements);
          this.setEventUpdated(rd.payload.page);
        } else {
          throw new Error('Can\'t retrieve OpenAIRE Broker events from the Broker events REST service');
        }
        this.openaireBrokerEventRestService.clearFindByTopicRequests()
      })
    );
  }

  /**
   * Set the project status for the OpenAIRE Broker events.
   *
   * @param {OpenaireBrokerEventObject[]} events
   *    the OpenAIRE Broker event item
   */
  protected setEventUpdated(events: OpenaireBrokerEventObject[]): void {
    this.subs.push(
      from(events).pipe(
        flatMap((event: OpenaireBrokerEventObject) => {
          return event.related.pipe(
            filter((rd: RemoteData<Item>) => (!rd.isResponsePending && isNotEmpty(rd.payload)) || rd.statusCode === 204),
            getRemoteDataPayload(),
            map((subRelated) => {
              const data: OpenaireBrokerEventData = {
                event: event,
                id: event.id,
                title: event.title,
                hasProject: false,
                projectTitle: null,
                projectId: null,
                handle: null,
                reason: null,
                isRunning: false
              };
              if (subRelated && subRelated.id) {
                data.hasProject = true;
                data.projectTitle = event.message.title;
                data.projectId = subRelated.id;
                data.handle = subRelated.handle;
              }
              return data;
            })
          );
        }),
        scan((acc: any, value: any) => [...acc, ...value], []),
        take(events.length)
      ).subscribe(
        (eventsReduced) => {
          this.eventsUpdated$.next(eventsReduced);
        }
      )
    );
  }

  /**
   * Update pagination Config from route params
   *
   * @param eventsRouteParams
   */
  protected updatePaginationFromRouteParams(eventsRouteParams: AdminNotificationsOpenaireEventsPageParams): void {
    if (eventsRouteParams.currentPage) {
      this.paginationConfig.currentPage = eventsRouteParams.currentPage;
    }
    if (eventsRouteParams.pageSize) {
      if (this.paginationConfig.pageSizeOptions.includes(eventsRouteParams.pageSize)) {
        this.paginationConfig.pageSize = eventsRouteParams.pageSize;
      } else {
        this.paginationConfig.pageSize = this.paginationConfig.pageSizeOptions[0];
      }
    }
  }

  /**
   * Unsubscribe from all subscriptions.
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }
}
