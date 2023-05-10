import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SelectableListService } from '../../../shared/object-list/selectable-list/selectable-list.service';
import { SelectableListState } from '../../../shared/object-list/selectable-list/selectable-list.reducer';
import { RemoteData } from '../../../core/data/remote-data';
import { buildPaginatedList, PaginatedList } from '../../../core/data/paginated-list.model';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { createSuccessfulRemoteDataObject } from '../../../shared/remote-data.utils';
import { PageInfo } from '../../../core/shared/page-info.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { hasValue } from '../../../shared/empty.util';

@Component({
  selector: 'ds-bulk-access-browse',
  template: `
    <ngb-accordion #acc="ngbAccordion" [activeIds]="'browse'">
      <ngb-panel [id]="'browse'">
        <ng-template ngbPanelHeader>
          <div class="w-100 d-flex justify-content-between collapse-toggle" ngbPanelToggle (click)="acc.toggle('browse')"
               data-test="browse">
            <button type="button" class="btn btn-link p-0" (click)="$event.preventDefault()"
                    [attr.aria-expanded]="!acc.isExpanded('browse')"
                    aria-controls="collapsePanels">
              {{ 'admin.access-control.bulk-access-browse.header' | translate }}
            </button>
            <div class="text-right d-flex">
              <div class="ml-3 d-inline-block">
                <span *ngIf="acc.isExpanded('browse')" class="fas fa-chevron-up fa-fw"></span>
                <span *ngIf="!acc.isExpanded('browse')" class="fas fa-chevron-down fa-fw"></span>
              </div>
            </div>
          </div>
        </ng-template>
        <ng-template ngbPanelContent>
          <ul ngbNav #nav="ngbNav" [(activeId)]="activateId" class="nav-pills">
            <li [ngbNavItem]="'search'">
              <a ngbNavLink>{{'admin.access-control.bulk-access-browse.search.header' | translate}}</a>
              <ng-template ngbNavContent>
                <div class="mx-n3">
                  <ds-themed-search [configuration]="'default'"
                                    [selectable]="true"
                                    [selectionConfig]="{ repeatable: true, listId: listId }"
                                    [showThumbnails]="false"></ds-themed-search>
                </div>
              </ng-template>
            </li>
            <li [ngbNavItem]="'selected'">
              <a
                ngbNavLink>{{'admin.access-control.bulk-access-browse.selected.header' | translate: {number: ((objectsSelected$ | async)?.payload?.totalElements) ? (objectsSelected$ | async)?.payload?.totalElements : '0'} }}</a>
              <ng-template ngbNavContent>
                <ds-viewable-collection [config]="paginationOptions"
                                        [hideGear]="true"
                                        [objects]="objectsSelected$ | async"
                                        [selectable]="true"
                                        [selectionConfig]="{ repeatable: true, listId: listId }"
                                        [showThumbnails]="false"></ds-viewable-collection>
              </ng-template>
            </li>
          </ul>
          <div [ngbNavOutlet]="nav" class="mt-5"></div>
        </ng-template>
      </ngb-panel>
    </ngb-accordion>
  `,
  styleUrls: ['./bulk-access-browse.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})
export class BulkAccessBrowseComponent implements OnInit, OnDestroy {

  /**
   * The selection list id
   */
  @Input() listId!: string;

  /**
   * The active nav id
   */
  activateId = 'search';

  /**
   * The list of the objects already selected
   */
  objectsSelected$: BehaviorSubject<RemoteData<PaginatedList<ListableObject>>> = new BehaviorSubject<RemoteData<PaginatedList<ListableObject>>>(null);

  /**
   * The pagination options object used for the list of selected elements
   */
  paginationOptions$: BehaviorSubject<PaginationComponentOptions> = new BehaviorSubject<PaginationComponentOptions>(Object.assign(new PaginationComponentOptions(), {
    id: 'bas',
    pageSize: 5,
    currentPage: 1
  }));

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  private subs: Subscription[] = [];

  constructor(private selectableListService: SelectableListService) {}

  /**
   * Subscribe to selectable list updates
   */
  ngOnInit(): void {

    this.subs.push(
      this.selectableListService.getSelectableList(this.listId).pipe(
        distinctUntilChanged(),
        map((list: SelectableListState) => this.generatePaginatedListBySelectedElements(list))
      ).subscribe(this.objectsSelected$)
    )
  }

  pageNext() {
    this.paginationOptions$.next(Object.assign(new PaginationComponentOptions(), this.paginationOptions$.value, {
      currentPage: this.paginationOptions$.value.currentPage + 1
    }));
    console.log(this.paginationOptions$.value);
  }

  pagePrev() {
    this.paginationOptions$.next(Object.assign(new PaginationComponentOptions(), this.paginationOptions$.value, {
      currentPage: this.paginationOptions$.value.currentPage - 1
    }));
    console.log(this.paginationOptions$.value);
  }

  private calculatePageCount(pageSize, totalCount = 0) {
    // we suppose that if we have 0 items we want 1 empty page
    return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
  };

  /**
   * Generate The RemoteData object containing the list of the selected elements
   * @param list
   * @private
   */
  private generatePaginatedListBySelectedElements(list: SelectableListState): RemoteData<PaginatedList<ListableObject>> {
    const pageInfo = new PageInfo({
      elementsPerPage: this.paginationOptions$.value.pageSize,
      totalElements: list?.selection.length,
      totalPages: this.calculatePageCount(this.paginationOptions$.value.pageSize, list?.selection.length),
      currentPage: this.paginationOptions$.value.currentPage
    });
    if (pageInfo.currentPage > pageInfo.totalPages) {
      pageInfo.currentPage = pageInfo.totalPages;
      this.paginationOptions$.next(Object.assign(new PaginationComponentOptions(), this.paginationOptions$.value, {
        currentPage: pageInfo.currentPage
      }));
    }
    return createSuccessfulRemoteDataObject(buildPaginatedList(pageInfo, list?.selection || []));
  }

  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
    this.selectableListService.deselectAll(this.listId)
  }
}
