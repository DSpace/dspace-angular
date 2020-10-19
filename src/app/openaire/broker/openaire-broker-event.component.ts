import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Observable, of as observableOf } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { find, map } from 'rxjs/operators';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { RemoteData } from '../../core/data/remote-data';
import { FindListOptions } from '../../core/data/request.models';
import { OpenaireBrokerEventObject } from '../../core/openaire/models/openaire-broker-event.model';
import { OpenaireBrokerEventRestService } from '../../core/openaire/openaire-broker-event-rest.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { hasValue } from '../../shared/empty.util';
import { ItemSearchResult } from '../../shared/object-collection/shared/item-search-result.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RestResponse } from '../../core/cache/response.models';
import { Metadata } from '../../core/shared/metadata.utils';
import {
  OpenaireBrokerEventData,
  ProjectEntryImportModalComponent
} from './project-entry-import-modal/project-entry-import-modal.component';

/**
 * Component to display the OpenAIRE Broker event list.
 */
@Component({
  selector: 'ds-openaire-broker-event',
  templateUrl: './openaire-broker-event.component.html',
  styleUrls: ['./openaire-broker-event.component.scss'],
})
export class OpenaireBrokerEventComponent implements OnInit {
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
   * The OpenAIRE Broker events list.
   * @type {Observable<OpenaireBrokerEventObject[]>}
   */
  public events$: Observable<OpenaireBrokerEventObject[]>;
  /**
   * Array to save the presence of a project inside an OpenAIRE Broker event.
   * @type {OpenaireBrokerEventData[]>}
   */
  public eventsUpdated: OpenaireBrokerEventData[];
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
   * Contains the information about the loading status of the page.
   * @type {Observable<boolean>}
   */
  public isEventPageLoading: Observable<boolean>;
  /**
   * Contains the information about the loading status of the events inside the pagination component.
   * @type {Observable<boolean>}
   */
  public isEventLoading: Observable<boolean>;
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
   * Component intitialization.
   */
  ngOnInit(): void {
    this.isEventPageLoading = observableOf(true);
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = 'openaire_broker_event';
    this.paginationConfig.pageSize = this.elementsPerPage;
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.pageSizeOptions = [ 5, 10, 20 ];

    this.subs.push(
      combineLatest(
        this.activatedRoute.paramMap.pipe(
          map((params) => {
            const regEx = /\!/g;
            this.showTopic = params.get('id').replace(regEx, '/');
            this.topic = params.get('id');
          })
        ),
        this.activatedRoute.data.pipe(
          map((data) => {
            if (data.openaireBrokerTopicsParams.currentPage) {
              this.paginationConfig.currentPage = data.openaireBrokerTopicsParams.currentPage;
            }
            if (data.openaireBrokerTopicsParams.pageSize) {
              if (this.paginationConfig.pageSizeOptions.includes(data.openaireBrokerTopicsParams.pageSize)) {
                this.paginationConfig.pageSize = data.openaireBrokerTopicsParams.currentPage;
              } else {
                this.paginationConfig.pageSize = this.paginationConfig.pageSizeOptions[0];
              }
            }
          })
        )
      )
      .subscribe(() => {
          this.isEventPageLoading = observableOf(false);
          this.getOpenaireBrokerEvents();
        }
      )
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
   * Set the project status for the OpenAIRE Broker events.
   *
   * @param {number} i
   *    the number of the OpenAIRE Broker event item
   * @param {OpenaireBrokerEventObject} item
   *    the OpenAIRE Broker event item
   */
  public setEventUpdated(items: OpenaireBrokerEventObject[]): void {
    for (let i = 0; i < items.length; i++) {
      this.eventsUpdated[i] = {
        id: items[i].id,
        title: items[i].title,
        hasProject: (items[i].message.matchFoundId) ? true : false,
        projectTitle: (items[i].message.title) ? items[i].message.title : null,
        projectId: (items[i].message.matchFoundId) ? items[i].message.matchFoundId : null,
        handle: (items[i].message.matchFoundHandle) ? items[i].message.matchFoundHandle : null
      }
    }
  }

  /**
   * Open a modal or run the executeAction directly based on the presence of the project.
   *
   * @param {string} action
   *    the action (can be: ACCEPTED, REJECTED, DISCARDED, PENDING)
   * @param {number} itemIndex
   *    the position of the OpenAIRE Broker event
   * @param {OpenaireBrokerEventObject} item
   *    the OpenAIRE Broker event item
   * @param {any} content
   *    Reference to the modal
   */
  public modalChoice(action: string, itemIndex: number, item: OpenaireBrokerEventObject, content: any): void {
    if (this.eventsUpdated[itemIndex].hasProject) {
      this.executeAction(action, item);
    } else {
      this.openModal(action, item, content);
    }
  }

  /**
   * Open the selected modal and performs the action if needed.
   *
   * @param {string} action
   *    the action (can be: ACCEPTED, REJECTED, DISCARDED, PENDING)
   * @param {OpenaireBrokerEventObject} item
   *    the OpenAIRE Broker event item
   * @param {any} content
   *    Reference to the modal
   */
  public openModal(action: string, item: OpenaireBrokerEventObject, content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        if (result === 'do') {
          this.executeAction(action, item);
        }
      },
      (_reason) => {
        // No Actions
      }
    );
  }

  /**
   * Open a modal where the user can select the project.
   *
   * @param {number} i
   *    the OpenAIRE Broker event position
   * @param {OpenaireBrokerEventData} itemData
   *    the OpenAIRE Broker event item
   */
  public openModalLookup(i: number, itemData: OpenaireBrokerEventData): void {
    this.modalRef = this.modalService.open(ProjectEntryImportModalComponent, {
      size: 'lg'
    });
    const modalComp = this.modalRef.componentInstance;
    modalComp.externalSourceEntry = itemData;
    modalComp.label = 'project';
    this.subs.push(
      modalComp.importedObject.subscribe((object: ItemSearchResult) => {
        const projectTitle = Metadata.first(object.indexableObject.metadata, 'dc.title');
        this.boundProject(
          i,
          itemData.id,
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
   * @param {OpenaireBrokerEventObject} item
   *    the OpenAIRE Broker event item
   */
  public executeAction(action: string, item: OpenaireBrokerEventObject): void {
    this.subs.push(
      this.openaireBrokerEventRestService.patchEvent(action, item).pipe(
        map((rd: RestResponse) => {
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
        })
      )
      .subscribe()
    );
  }

  /**
   * Bound a project to the publication described in the OpenAIRE Broker event calling the REST service.
   *
   * @param {number} i
   *    the OpenAIRE Broker event position
   * @param {string} itemId
   *    the OpenAIRE Broker event Id
   * @param {string} projectId
   *    the project Id to bound
   * @param {string} projectTitle
   *    the project title
   * @param {string} projectHandle
   *    the project handle
   */
  public boundProject(i: number, itemId: string, projectId: string, projectTitle: string, projectHandle: string): void {
    this.subs.push(
      this.openaireBrokerEventRestService.boundProject(itemId, projectId).pipe(
        map((rd: RestResponse) => {
          if (rd.isSuccessful && rd.statusCode === 201) {
            this.notificationsService.success(
              this.translateService.instant('openaire.broker.event.project.bounded')
            );
            this.eventsUpdated[i].hasProject = true;
            this.eventsUpdated[i].projectTitle = projectTitle,
            this.eventsUpdated[i].handle = projectHandle;
            this.eventsUpdated[i].projectId = projectId;
          } else {
            this.notificationsService.error(
              this.translateService.instant('openaire.broker.event.project.error')
            );
          }
        })
      )
      .subscribe()
    );
  }

  /**
   * Remove the bounded project from the publication described in the OpenAIRE Broker event calling the REST service.
   *
   * @param {number} i
   *    the OpenAIRE Broker event position
   * @param {string} itemId
   *    the OpenAIRE Broker event Id
   */
  public removeProject(i: number, itemId: string): void {
    this.subs.push(
      this.openaireBrokerEventRestService.removeProject(itemId).pipe(
        map((rd: RestResponse) => {
          if (rd.isSuccessful && rd.statusCode === 204) {
            this.notificationsService.success(
              this.translateService.instant('openaire.broker.event.project.removed')
            );
            this.eventsUpdated[i].hasProject = false;
            this.eventsUpdated[i].projectTitle = null;
            this.eventsUpdated[i].handle = null;
            this.eventsUpdated[i].projectId = null;
          } else {
            this.notificationsService.error(
              this.translateService.instant('openaire.broker.event.project.error')
            );
          }
        })
      )
      .subscribe()
    );
  }

  /**
   * Dispatch the OpenAIRE Broker events retrival.
   */
  protected getOpenaireBrokerEvents(): void {
    this.isEventLoading = observableOf(true);
    this.eventsUpdated = [];
    const options: FindListOptions = {
      elementsPerPage: this.paginationConfig.pageSize,
      currentPage: this.paginationConfig.currentPage,
    };
    this.subs.push(
      this.openaireBrokerEventRestService.getEventsByTopic(
        this.topic,
        options
      ).pipe(
        find((rd: RemoteData<PaginatedList<OpenaireBrokerEventObject>>) => !rd.isResponsePending),
        map((rd: RemoteData<PaginatedList<OpenaireBrokerEventObject>>) => {
          if (rd.hasSucceeded) {
            this.isEventLoading = observableOf(false);
            this.totalElements$ = observableOf(rd.payload.totalElements);
            this.events$ = observableOf(rd.payload.page);
            this.setEventUpdated(rd.payload.page);
          } else {
            throw new Error('Can\'t retrieve OpenAIRE Broker events from the Broker events REST service');
          }
        })
      ).subscribe()
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
}
