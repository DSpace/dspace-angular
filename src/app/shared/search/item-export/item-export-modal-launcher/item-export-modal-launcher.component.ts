import { Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Item } from '../../../../core/shared/item.model';
import { SearchOptions } from '../../models/search-options.model';
import { ItemExportComponent } from '../item-export/item-export.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { ItemExportFormatMolteplicity } from '../../../../core/itemexportformat/item-export-format.service';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { ConfigurationDataService } from '../../../../core/data/configuration-data.service';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { hasValue, isNotEmpty } from '../../../empty.util';

@Component({
  selector: 'ds-item-export-modal-launcher',
  templateUrl: './item-export-modal-launcher.component.html'
})
export class ItemExportModalLauncherComponent implements OnInit, OnDestroy {

  @ViewChild('template', {static: true}) template;

  @Input() item: Item;
  @Input() searchOptions$: Observable<SearchOptions>;

  bulkExportLimit = '0';

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor(private modalService: NgbModal,
              private authService: AuthService,
              private authorizationService: AuthorizationDataService,
              private configService: ConfigurationDataService,
              private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.subs.push(this.isAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.subs.push(this.isCurrentUserAdmin().subscribe(isAdmin => {
          if (isAdmin) {
            this.findByPropertyName(BULK_EXPORT_LIMIT_ADMIN);
          } else {
            this.findByPropertyName(BULK_EXPORT_LIMIT_LOGGEDIN);
          }
        }));
      } else {
        this.findByPropertyName(BULK_EXPORT_LIMIT_NOTLOGGEDIN);
      }
    }));
  }

  getLabel() {
    return this.item ? 'Export' : 'Bulk Export';
  }

  open(event) {
    if (this.item) {

      // open a single item-export modal
      const modalRef = this.modalService.open(ItemExportComponent);
      modalRef.componentInstance.molteplicity = ItemExportFormatMolteplicity.SINGLE;
      modalRef.componentInstance.item = this.item;
      modalRef.componentInstance.itemType = event;
      modalRef.componentInstance.bulkExportLimit = this.bulkExportLimit;

    } else if (this.searchOptions$) {

      // open a bulk-item-export modal
      this.searchOptions$.pipe(take(1)).subscribe((searchOptions) => {
        const modalRef = this.modalService.open(ItemExportComponent);
        modalRef.componentInstance.molteplicity = ItemExportFormatMolteplicity.MULTIPLE;
        modalRef.componentInstance.searchOptions = searchOptions;
        modalRef.componentInstance.itemType = event;
        modalRef.componentInstance.bulkExportLimit = this.bulkExportLimit;
      });
    }

  }

  /**
   * Return if the user is authenticated
   */
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  /**
   * Return if the user is admin
   */
  isCurrentUserAdmin(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, undefined, undefined);
  }

  /**
   * it will fetch the export limit according to property
   */
  findByPropertyName(property) {
    this.subs.push(this.configService.findByPropertyName(property).pipe(
      getFirstCompletedRemoteData()
    ).subscribe(res => {
      if (res.hasSucceeded && res.payload && isNotEmpty(res.payload.values)) {
        this.bulkExportLimit = res.payload.values[0];
      } else {
        this.bulkExportLimit = '0';
      }
    }));
  }

  cleanupSubscribes() {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  /**
   * Unsub all subscriptions
   */
  ngOnDestroy(): void {
    this.cleanupSubscribes();
  }

}

export const BULK_EXPORT_LIMIT_ADMIN = 'bulk-export.limit.admin';
export const BULK_EXPORT_LIMIT_LOGGEDIN = 'bulk-export.limit.loggedIn';
export const BULK_EXPORT_LIMIT_NOTLOGGEDIN = 'bulk-export.limit.notLoggedIn';
