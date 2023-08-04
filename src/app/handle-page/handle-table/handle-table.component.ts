import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest as observableCombineLatest, fromEvent } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { HandleDataService } from '../../core/data/handle-data.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { getFirstSucceededRemoteData, getRemoteDataPayload } from '../../core/shared/operators';
import { PaginationService } from '../../core/pagination/pagination.service';
import {
  getHandleTableModulePath,
  HANDLE_TABLE_EDIT_HANDLE_PATH,
  HANDLE_TABLE_NEW_HANDLE_PATH
} from '../handle-page-routing-paths';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { Router } from '@angular/router';
import { DeleteRequest } from '../../core/data/request.models';
import { RequestService } from '../../core/data/request.service';
import { defaultPagination, defaultSortConfiguration } from './handle-table-pagination';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { Handle } from '../../core/handle/handle.model';
import {
  COLLECTION,
  COMMUNITY,
  ITEM,
  SITE,
  SUCCESSFUL_RESPONSE_START_CHAR
} from '../../core/handle/handle.resource-type';

/**
 * Constants for converting the searchQuery for the server
 */
export const HANDLE_SEARCH_OPTION = 'handle';
export const URL_SEARCH_OPTION = 'url';
export const RESOURCE_TYPE_SEARCH_OPTION = 'resourceTypeId';

/**
 * The component which contains the Handle table and search panel for filtering the handles.
 */
@Component({
  selector: 'ds-handle-table',
  templateUrl: './handle-table.component.html',
  styleUrls: ['./handle-table.component.scss']
})
export class HandleTableComponent implements OnInit {

  constructor(private handleDataService: HandleDataService,
              private paginationService: PaginationService,
              public router: Router,
              private requestService: RequestService,
              private cdr: ChangeDetectorRef,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,) {
  }

  /**
   * The reference for the input html element
   */
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;

  /**
   * The list of Handle object as BehaviorSubject object
   */
  handlesRD$: BehaviorSubject<RemoteData<PaginatedList<Handle>>> = new BehaviorSubject<RemoteData<PaginatedList<Handle>>>(null);

  /**
   * The amount of versions to display per page
   */
  pageSize = 10;

  /**
   * The page options to use for fetching the versions
   * Start at page 1 and always use the set page size
   */
  options: PaginationComponentOptions;

  /**
   * The configuration which is send to the server with search request.
   */
  sortConfiguration: SortOptions;

  /**
   * The value typed in the search panel.
   */
  searchQuery = '';

  /**
   * Filter the handles based on this column.
   */
  searchOption: string;

  /**
   * String value of the `Handle` search option. This value is loaded from the `en.json5`.
   */
  handleOption: string;

  /**
   * String value of the `Internal` search option. This value is loaded from the `en.json5`.
   */
  internalOption: string;

  /**
   * String value of the `Resource type` search option. This value is loaded from the `en.json5`.
   */
  resourceTypeOption: string;

  /**
   * If the request isn't processed show to loading bar.
   */
  isLoading = false;

  /**
   * The handle redirection link.
   */
  handleRoute: string;

  /**
   * The new handle redirection link.
   */
  newHandlePath = HANDLE_TABLE_NEW_HANDLE_PATH;

  /**
   * The edit handle redirection link.
   */
  editHandlePath = HANDLE_TABLE_EDIT_HANDLE_PATH;

  /**
   * The handle which is selected in the handle table.
   */
  selectedHandle = null;

  ngOnInit(): void {
    this.handleRoute = getHandleTableModulePath();
    this.initializePaginationOptions();
    this.initializeSortingOptions();
    this.getAllHandles();

    this.handleOption = this.translateService.instant('handle-table.table.handle');
    this.internalOption = this.translateService.instant('handle-table.table.internal');
    this.resourceTypeOption = this.translateService.instant('handle-table.table.resource-type');
  }

  /**
   * Load all handles based on the pagination and sorting options.
   */
  getAllHandles() {
    this.handlesRD$ = new BehaviorSubject<RemoteData<PaginatedList<Handle>>>(null);
    this.isLoading = true;

    // load the current pagination and sorting options
    const currentPagination$ = this.paginationService.getCurrentPagination(this.options.id, this.options);
    const currentSort$ = this.paginationService.getCurrentSort(this.options.id, this.sortConfiguration);

    observableCombineLatest([currentPagination$, currentSort$]).pipe(
      switchMap(([currentPagination, currentSort]) => {
        return this.handleDataService.findAll({
            currentPage: currentPagination.currentPage,
            elementsPerPage: currentPagination.pageSize,
            sort: {field: currentSort.field, direction: currentSort.direction}
          }, false
        );
      }),
      getFirstSucceededRemoteData()
    ).subscribe((res: RemoteData<PaginatedList<Handle>>) => {
      this.handlesRD$.next(res);
      this.isLoading = false;
    });
  }

  /**
   * Updates the page
   */
  onPageChange() {
    this.getAllHandles();
  }

  /**
   * Mark the handle as selected or unselect if it is already clicked.
   * @param handleId id of the selected handle
   */
  switchSelectedHandle(handleId) {
    if (this.selectedHandle === handleId) {
      this.selectedHandle = null;
    } else {
      this.selectedHandle = handleId;
    }
  }

  /**
   * Redirect to the new handle component with the current pagination options.
   */
  redirectWithCurrentPage() {
    this.router.navigate([this.handleRoute, this.newHandlePath],
      { queryParams: { currentPage: this.options.currentPage } },
    );
  }

  /**
   * Redirect to the edit handle component with the handle attributes passed in the url.
   */
  redirectWithHandleParams() {
    // check if is selected some handle
    if (isEmpty(this.selectedHandle)) {
      return;
    }

    this.handlesRD$.pipe(
      // take just one value from subscription because if is the subscription active this code runs after every
      // this.handleRD$ update
      take(1)
    ).subscribe((handleRD) => {
      handleRD.payload.page.forEach(handle => {
        if (handle.id === this.selectedHandle) {
          this.switchSelectedHandle(this.selectedHandle);
          this.router.navigate([this.handleRoute, this.editHandlePath],
            { queryParams: { id: handle.id, _selflink: handle._links.self.href, handle: handle.handle,
                url: handle.url, resourceType: handle.resourceTypeID, resourceId: handle.id,
                currentPage: this.options.currentPage } },
          );
        }
      });
    });
  }

  /**
   * Delete selected handle
   */
  deleteHandles() {
    // check if is selected some handle
    if (isEmpty(this.selectedHandle)) {
      return;
    }

    let requestId = '';
    // delete handle
    this.handlesRD$.pipe(
      // take just one value from subscription because if is the subscription active this code runs after every
      // this.handleRD$ update
      take(1)
    ).subscribe((handleRD) => {
      handleRD.payload.page.forEach(handle => {
        if (handle.id === this.selectedHandle) {
          requestId = this.requestService.generateRequestId();
          const deleteRequest = new DeleteRequest(requestId, handle._links.self.href);
          // call delete request
          this.requestService.send(deleteRequest);
          // unselect deleted handle
          this.refreshTableAfterDelete(handle.id);
        }
      });
    });

    // check response
    this.requestService.getByUUID(requestId)
      .subscribe(info => {
        // if is empty
        if (!isNotEmpty(info) || !isNotEmpty(info.response) || !isNotEmpty(info.response.statusCode)) {
          // do nothing - in another subscription should be data
          return;
        }

        if (info.response.statusCode.toString().startsWith(SUCCESSFUL_RESPONSE_START_CHAR)) {
          this.notificationsService.success(null, this.translateService.get('handle-table.delete-handle.notify.successful'));
        } else {
          // write error in the notification
          // compose error message with message definition and server error
          let errorMessage = '';
          this.translateService.get('handle-table.delete-handle.notify.error').pipe(
            take(1)
          ).subscribe( message => {
            errorMessage = message + ': ' + info.response.errorMessage;
          });

          this.notificationsService.error(null, errorMessage);
        }
      });
  }

  /**
   * Deleted handle must be removed from the table. Wait for removing the handle from the server and then load
   * the handles again.
   * @param deletedHandleId
   */
  public refreshTableAfterDelete(deletedHandleId) {
    let counter = 0;
    // The timeout for checking if the handle was daleted in the database
    // The timeout is set to 20 seconds by default.
    const refreshTimeout = 20;

    this.isLoading = true;
    const interval = setInterval( () => {
      let isHandleInTable = false;
      // Load handle from the DB
      this.handleDataService.findAll( {
          currentPage: this.options.currentPage,
          elementsPerPage: this.options.pageSize,
        }, false
      ).pipe(
        getFirstSucceededRemoteData(),
        getRemoteDataPayload()
      ).subscribe(handles => {
        // check if the handle is in the table data
        if (handles.page.some(handle => handle.id === deletedHandleId)) {
          isHandleInTable = true;
        }

        // reload table if the handle was removed from the database
        if (!isHandleInTable) {
          this.switchSelectedHandle(deletedHandleId);
          this.getAllHandles();
          this.cdr.detectChanges();
          clearInterval(interval);
        }
      });

      // Clear interval after 20s timeout
      if (counter === ( refreshTimeout * 1000 ) / 250) {
        this.isLoading = false;
        this.cdr.detectChanges();
        clearInterval(interval);
      }
      counter++;
    }, 250 );
  }

  /**
   * If the user is typing the searchQuery is changing.
   */
  setSearchQuery() {
    if (isEmpty(this.searchOption)) {
      return;
    }

    fromEvent(this.searchInput.nativeElement,'keyup')
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe( cc => {
        this.searchHandles(this.searchInput.nativeElement.value);
        setTimeout(() => {
          // click to refresh table data because without click it still shows wrong data
          document.getElementById('clarin-dc-search-box').click();
        }, 25);
      });

  }

  /**
   * The search option is selected from the dropdown menu.
   * @param event with the selected value
   */
  setSearchOption(event) {
    this.searchOption = event?.target?.innerHTML;
  }

  /**
   * Update the sortConfiguration based on the `searchOption` and the `searchQuery` but parse that attributes at first.
   * @param searchQuery
   */
  searchHandles(searchQuery = '') {
    if (isEmpty(this.searchOption)) {
      return;
    }

    // parse searchQuery for the server request
    // the new sorting query is in the format e.g. `handle:123456`, `resourceTypeId:2`, `url:internal`
    let parsedSearchOption = '';
    let parsedSearchQuery = searchQuery;
    switch (this.searchOption) {
      case this.handleOption:
        parsedSearchOption = HANDLE_SEARCH_OPTION;
        break;
      case this.internalOption:
        // if the handle doesn't have the URL - is internal, if it does - is external
        parsedSearchOption = URL_SEARCH_OPTION;
        if (searchQuery === 'Yes' || searchQuery === 'yes') {
          parsedSearchQuery = 'internal';
        } else if (searchQuery === 'No' || searchQuery === 'no') {
          parsedSearchQuery = 'external';
        }
        break;
      case this.resourceTypeOption:
        parsedSearchOption = RESOURCE_TYPE_SEARCH_OPTION;
        // parse resourceType from string to the number because the resourceType is integer on the server
        switch (searchQuery) {
          case ITEM:
            parsedSearchQuery = '' + 2;
            break;
          case COLLECTION:
            parsedSearchQuery = '' + 3;
            break;
          case COMMUNITY:
            parsedSearchQuery = '' + 4;
            break;
          case SITE:
            parsedSearchQuery = '' + 5;
        }
        break;
      default:
        parsedSearchOption = '';
        break;
    }

    this.sortConfiguration.field = parsedSearchOption + ':' + parsedSearchQuery;
    this.getAllHandles();
  }

  private initializePaginationOptions() {
    this.options = defaultPagination;
  }

  private initializeSortingOptions() {
    this.sortConfiguration = defaultSortConfiguration;
  }
}
