import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { SubmissionState } from '../../../submission/submission.reducers';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { Router } from '@angular/router';
import { EntityTypeService } from '../../../core/data/entity-type.service';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { PageInfo } from "../../../core/shared/page-info.model";
import { FindListOptions } from "../../../core/data/request.models";

/**
 * This component represents the whole mydspace page header
 */
@Component({
  selector: 'ds-my-dspace-new-submission-dropdown',
  styleUrls: ['./my-dspace-new-submission-dropdown.component.scss'],
  templateUrl: './my-dspace-new-submission-dropdown.component.html'
})
export class MyDSpaceNewSubmissionDropdownComponent implements OnDestroy, OnInit {

  /**
   * Subscription to unsubscribe from
   */
  private subs: Subscription[] = [];

  initialized = false;
  loading = false;

  availableEntyTypeList: Set<string>;
  pageInfo: PageInfo;

  /**
   * Initialize instance variables
   *
   * @param {AuthService} authService
   * @param {ChangeDetectorRef} changeDetectorRef
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {Store<SubmissionState>} store
   * @param {TranslateService} translate
   */
  constructor(private authService: AuthService,
              private changeDetectorRef: ChangeDetectorRef,
              private halService: HALEndpointService,
              private notificationsService: NotificationsService,
              private entityTypeService: EntityTypeService,
              private router: Router,
              private store: Store<SubmissionState>,
              private translate: TranslateService) {
    this.availableEntyTypeList = new Set<string>();
    this.pageInfo = new PageInfo();
    this.pageInfo.elementsPerPage = 3;
    this.pageInfo.currentPage = 1;
  }

  /**
   * Initialize url and Bearer token
   */
  ngOnInit() {

    this.loadEntityTypes(this.toPageOptions());
  }

  private toPageOptions() {
    return {
      currentPage: this.pageInfo.currentPage,
      elementsPerPage: this.pageInfo.elementsPerPage,
    } as FindListOptions;
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    for (const s of this.subs) {
      s.unsubscribe();
    }
  }

  loadEntityTypes(pageInfo: FindListOptions) {
    this.loading = true;
    this.subs.push(this.entityTypeService.getAllAuthorizedRelationshipType(pageInfo).subscribe((x: RemoteData<PaginatedList<ItemType>>) => {
        this.initialized = true
        this.loading = false;
        if (!x || !x.payload || !x.payload.page) {
          return;
        }
        this.pageInfo.totalPages = x.payload.pageInfo.totalPages;
        x.payload.page.forEach((type: ItemType) => this.availableEntyTypeList.add(type.label));
      },
      () => {
        this.initialized = true;
        this.loading = false;
      },
      () => {
        this.initialized = true;
        this.loading = false;
      }));
  }

  onScroll() {
    if (!this.loading && this.pageInfo.currentPage < this.pageInfo.totalPages) {
      this.pageInfo.currentPage++;
      this.loadEntityTypes(this.toPageOptions());
    }
  }

  hasMultipleOptions(): boolean {
    return this.availableEntyTypeList && this.availableEntyTypeList.size > 1;
  }
}
