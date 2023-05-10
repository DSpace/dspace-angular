import { Component, OnInit } from '@angular/core';

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
export class BulkAccessBrowseComponent implements OnInit {
  /**
   * The active nav id
   */
  activateId = 'search';

  /**
   * The selection list id
   */
  listId: string = 'bulk-access-list';

  /**
   * The list of the objects already selected
   */
  objectsSelected$: BehaviorSubject<RemoteData<PaginatedList<ListableObject>>> = new BehaviorSubject<RemoteData<PaginatedList<ListableObject>>>(null);

  paginationOptions: PaginationComponentOptions;
  private subs: Subscription[] = [];

  constructor(private selectableListService: SelectableListService) {}

  ngOnInit(): void {
    this.paginationOptions = Object.assign(new PaginationComponentOptions(), {
      id: 'elp',
      pageSize: 10,
      currentPage: 1
    });
    this.subs.push(
      this.selectableListService.getSelectableList(this.listId).pipe(
        distinctUntilChanged(),
        map((list: SelectableListState) => {
          console.log(list);
          return createSuccessfulRemoteDataObject(buildPaginatedList(new PageInfo(), list?.selection || []))
        })
      ).subscribe(this.objectsSelected$)
    )
  }

}
