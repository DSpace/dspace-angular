import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { uniqueId } from 'lodash'

import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { PaginationComponentOptions } from '../../../pagination/pagination-component-options.model';
import { DataService } from '../../../../core/data/data.service';
import { hasValue, isNotEmpty } from '../../../empty.util';
import { FindListOptions } from '../../../../core/data/request.models';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { getDataServiceFor } from '../../../../core/cache/builders/build-decorators';
import { EPERSON } from '../../../../core/eperson/models/eperson.resource-type';
import { GROUP } from '../../../../core/eperson/models/group.resource-type';
import { ResourceType } from '../../../../core/shared/resource-type';

@Component({
  selector: 'ds-eperson-group-list',
  styleUrls: ['./eperson-group-list.component.scss'],
  templateUrl: './eperson-group-list.component.html'
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
   * Pagination config used to display the list
   */
  public paginationOptions: PaginationComponentOptions = new PaginationComponentOptions();

  /**
   * The data service used to make request.
   * It could be EPersonDataService or GroupDataService
   */
  private dataService: DataService<DSpaceObject>;

  /**
   * A list of eperson or group
   */
  private list$: BehaviorSubject<RemoteData<PaginatedList<DSpaceObject>>> = new BehaviorSubject<RemoteData<PaginatedList<DSpaceObject>>>({} as any);

  /**
   * The eperson or group's id selected
   * @type {string}
   */
  private entrySelectedId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  constructor(public dsoNameService: DSONameService, private parentInjector: Injector) {
    const resourceType: ResourceType = (this.isListOfEPerson) ? EPERSON : GROUP;
    const provider = getDataServiceFor(resourceType);
    this.dataService = Injector.create({
      providers: [],
      parent: this.parentInjector
    }).get(provider);
  }

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    this.paginationOptions.id = uniqueId('eperson-group-list-pagination');
    this.paginationOptions.pageSize = 5;

    if (this.initSelected) {
      this.entrySelectedId.next(this.initSelected);
    }

    this.updateList(this.paginationOptions);
  }

  /**
   * Method called when an entry is selected.
   * Emit a new select Event
   *
   * @param entry The eperson or group selected
   */
  emitSelect(entry: DSpaceObject): void {
    this.select.emit(entry);
    this.entrySelectedId.next(entry.id);
  }

  /**
   * Return the list of eperson or group
   */
  getList(): Observable<RemoteData<PaginatedList<DSpaceObject>>> {
    return this.list$.asObservable();
  }

  /**
   * Return a boolean representing if a table row is selected
   *
   * @return {boolean}
   */
  isSelected(entry: DSpaceObject): Observable<boolean> {
    return this.entrySelectedId.asObservable().pipe(
      map((selectedId) => isNotEmpty(selectedId) && selectedId === entry.id)
    )
  }

  /**
   * Method called on page change
   */
  onPageChange(page: number): void {
    this.paginationOptions.currentPage = page;
    this.updateList(this.paginationOptions);
  }

  /**
   * Retrieve a paginate list of eperson or group
   */
  updateList(config: PaginationComponentOptions): void {
    const options: FindListOptions = Object.assign({}, new FindListOptions(), {
      elementsPerPage: config.pageSize,
      currentPage: config.currentPage
    });

    this.subs.push(this.dataService.findAll(options).pipe(take(1))
      .subscribe((list: RemoteData<PaginatedList<DSpaceObject>>) => {
        this.list$.next(list)
      })
    );
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.list$ = null;
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe())
  }

}
