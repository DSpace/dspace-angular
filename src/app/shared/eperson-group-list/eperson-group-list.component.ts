import { AsyncPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { FindListOptions } from '@dspace/core/data/find-list-options.model';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import {
  APP_DATA_SERVICES_MAP,
  LazyDataServicesMap,
} from '@dspace/core/data-services-map-type';
import { EPersonDataService } from '@dspace/core/eperson/eperson-data.service';
import { GroupDataService } from '@dspace/core/eperson/group-data.service';
import { EPerson } from '@dspace/core/eperson/models/eperson.model';
import { EPERSON } from '@dspace/core/eperson/models/eperson.resource-type';
import { Group } from '@dspace/core/eperson/models/group.model';
import { GROUP } from '@dspace/core/eperson/models/group.resource-type';
import { lazyDataService } from '@dspace/core/lazy-data-service';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import {
  getAllCompletedRemoteData,
  getRemoteDataPayload,
} from '@dspace/core/shared/operators';
import { ResourceType } from '@dspace/core/shared/resource-type';
import { TranslateModule } from '@ngx-translate/core';
import uniqueId from 'lodash/uniqueId';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { fadeInOut } from '../animations/fade';
import { PaginationComponent } from '../pagination/pagination.component';
import { SearchEvent } from './eperson-group-list-event-type';
import { EpersonSearchBoxComponent } from './eperson-search-box/eperson-search-box.component';
import { GroupSearchBoxComponent } from './group-search-box/group-search-box.component';


@Component({
  selector: 'ds-eperson-group-list',
  styleUrls: ['./eperson-group-list.component.scss'],
  templateUrl: './eperson-group-list.component.html',
  animations: [
    fadeInOut,
  ],
  standalone: true,
  imports: [
    AsyncPipe,
    EpersonSearchBoxComponent,
    GroupSearchBoxComponent,
    PaginationComponent,
    TranslateModule,
  ],
})
/**
 * Component that shows a list of eperson or group
 */
export class EpersonGroupListComponent implements OnInit, OnDestroy {

  /**
   * A boolean representing id component should list eperson or group
   */
  @Input() isListOfEPerson = true;

  /**
   * The uuid of eperson or group initially selected
   */
  @Input() initSelected: string;

  /**
   * An event fired when a eperson or group is selected.
   * Event's payload equals to DSpaceObject.
   */
  @Output() select: EventEmitter<DSpaceObject> = new EventEmitter<DSpaceObject>();

  /**
   * Current search query
   */
  public currentSearchQuery = '';

  /**
   * Current search scope
   */
  public currentSearchScope = 'metadata';

  /**
   * Pagination config used to display the list
   */
  public paginationOptions: PaginationComponentOptions = new PaginationComponentOptions();

  /**
   * The data service used to make request.
   * It could be EPersonDataService or GroupDataService
   */
  private dataService: EPersonDataService | GroupDataService;

  /**
   * A list of eperson or group
   */
  list$: Observable<PaginatedList<EPerson | Group>>;

  /**
   * The eperson or group's id selected
   * @type {string}
   */
  entrySelectedId$: BehaviorSubject<string> = new BehaviorSubject('');

  /**
   * Initialize instance variables and inject the properly UpdateDataServiceImpl
   *
   * @param {DSONameService} dsoNameService
   * @param {Injector} parentInjector
   * @param {PaginationService} paginationService
   * @param {APP_DATA_SERVICES_MAP} dataServiceMap
   */
  constructor(public dsoNameService: DSONameService,
              private parentInjector: Injector,
              private paginationService: PaginationService,
              @Inject(APP_DATA_SERVICES_MAP) private dataServiceMap: LazyDataServicesMap) {
  }

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    const resourceType: ResourceType = (this.isListOfEPerson) ? EPERSON : GROUP;
    const lazyProvider$: Observable<EPersonDataService | GroupDataService> = lazyDataService(this.dataServiceMap, resourceType.value, this.parentInjector);
    lazyProvider$.subscribe((dataService: EPersonDataService | GroupDataService) => {
      this.dataService = dataService;
      this.paginationOptions.id = uniqueId('egl');
      this.paginationOptions.pageSize = 5;

      if (this.initSelected) {
        this.entrySelectedId$.next(this.initSelected);
      }

      this.updateList(this.currentSearchScope, this.currentSearchQuery);
    });
  }

  /**
   * Method called when an entry is selected.
   * Emit a new select Event
   *
   * @param entry The eperson or group selected
   */
  emitSelect(entry: DSpaceObject): void {
    this.select.emit(entry);
    this.entrySelectedId$.next(entry.id);
  }

  /**
   * Method called on search
   */
  onSearch(searchEvent: SearchEvent) {
    this.currentSearchQuery = searchEvent.query;
    this.currentSearchScope = searchEvent.scope;
    this.paginationService.resetPage(this.paginationOptions.id);
    this.updateList(this.currentSearchScope, this.currentSearchQuery);
  }

  /**
   * Retrieve a paginate list of eperson or group
   */
  updateList(scope: string, query: string): void {
    this.list$ = this.paginationService.getCurrentPagination(this.paginationOptions.id, this.paginationOptions).pipe(
      switchMap((paginationOptions) => {
        const options: FindListOptions = Object.assign(new FindListOptions(), {
          elementsPerPage: paginationOptions.pageSize,
          currentPage: paginationOptions.currentPage,
        });

        return this.isListOfEPerson ?
          (this.dataService as EPersonDataService).searchByScope(scope, query, options) :
          (this.dataService as GroupDataService).searchGroups(query, options);
      }),
      getAllCompletedRemoteData(),
      getRemoteDataPayload(),
    );
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.paginationOptions.id);
  }


}
