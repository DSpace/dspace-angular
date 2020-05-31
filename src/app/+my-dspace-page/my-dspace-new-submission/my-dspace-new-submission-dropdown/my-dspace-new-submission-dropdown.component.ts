import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

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

  availableEntyTypeList: Set<string>;
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
  }

  /**
   * Initialize url and Bearer token
   */
  ngOnInit() {
    this.subs.push(this.entityTypeService.getAllAuthorizedRelationshipType().subscribe((x: RemoteData<PaginatedList<ItemType>>) => {
        this.initialized = true
        if (!x || !x.payload || !x.payload.page) {
          return;
        }
        x.payload.page.forEach((type: ItemType) => this.availableEntyTypeList.add(type.label));
      },
      () => {
        this.initialized = true;
      },
      () => {
        this.initialized = true
      }));
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    for (const s of this.subs) {
      s.unsubscribe();
    }
  }

  hasMultipleOptions(): boolean {
    return this.availableEntyTypeList && this.availableEntyTypeList.size > 1;
  }
}
