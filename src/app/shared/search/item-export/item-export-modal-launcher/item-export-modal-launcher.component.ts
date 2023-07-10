import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Item } from '../../../../core/shared/item.model';
import { SearchOptions } from '../../models/search-options.model';
import { ItemExportComponent } from '../item-export/item-export.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { ItemExportFormatMolteplicity } from '../../../../core/itemexportformat/item-export-format.service';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { ConfigurationDataService } from '../../../../core/data/configuration-data.service';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { isNotEmpty } from '../../../empty.util';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal-config';

export const BULK_EXPORT_LIMIT_ADMIN = 'bulk-export.limit.admin';
export const BULK_EXPORT_LIMIT_LOGGEDIN = 'bulk-export.limit.loggedIn';
export const BULK_EXPORT_LIMIT_NOTLOGGEDIN = 'bulk-export.limit.notLoggedIn';

@Component({
  selector: 'ds-item-export-modal-launcher',
  styleUrls: ['./item-export-modal-launcher.component.scss'],
  templateUrl: './item-export-modal-launcher.component.html'
})
export class ItemExportModalLauncherComponent implements OnInit {

  @ViewChild('template', {static: true}) template;

  @Input() item: Item;
  @Input() searchOptions$: Observable<SearchOptions>;

  bulkExportLimit = '0';

  constructor(private modalService: NgbModal,
              private authService: AuthService,
              private authorizationService: AuthorizationDataService,
              private configService: ConfigurationDataService,
              private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);

    combineLatest([this.isAuthenticated(), this.isCurrentUserAdmin()]).pipe(
      take(1),
      switchMap(([isAuthenticated, isAdmin]) => {
        let propertyName ;
        if (isAuthenticated) {
          if (isAdmin) {
            propertyName = BULK_EXPORT_LIMIT_ADMIN;
          } else {
            propertyName = BULK_EXPORT_LIMIT_LOGGEDIN;
          }
        } else {
          propertyName = BULK_EXPORT_LIMIT_NOTLOGGEDIN;
        }

        return this.findByPropertyName(propertyName);
      })
    ).subscribe((bulkExportLimit: string) => {
      this.bulkExportLimit = bulkExportLimit;
    });
  }

  getLabel() {
    return this.item ? 'Export' : 'Bulk Export';
  }

  open(event) {
    const modalOptions: NgbModalOptions = {
      size: 'xl',
    };
    if (this.item) {

      // open a single item-export modal
      const modalRef = this.modalService.open(ItemExportComponent, modalOptions);
      modalRef.componentInstance.molteplicity = ItemExportFormatMolteplicity.SINGLE;
      modalRef.componentInstance.item = this.item;
      modalRef.componentInstance.itemType = event;
      modalRef.componentInstance.bulkExportLimit = this.bulkExportLimit;

    } else if (this.searchOptions$) {

      // open a bulk-item-export modal
      this.searchOptions$.pipe(take(1)).subscribe((searchOptions) => {
        const modalRef = this.modalService.open(ItemExportComponent, modalOptions);
        modalRef.componentInstance.molteplicity = ItemExportFormatMolteplicity.MULTIPLE;
        modalRef.componentInstance.searchOptions = searchOptions;
        modalRef.componentInstance.itemType = event;
        modalRef.componentInstance.bulkExportLimit = this.bulkExportLimit;
        modalRef.componentInstance.showListSelection = true;
      });
    }

  }

  /**
   * Return if the user is authenticated
   */
  isAuthenticated(): Observable<boolean> {
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
  findByPropertyName(property): Observable<string> {
    return this.configService.findByPropertyName(property).pipe(
      getFirstCompletedRemoteData(),
      map((res) => {
        return (res.hasSucceeded && res.payload && isNotEmpty(res.payload.values)) ? res.payload.values[0] : '0';
    }));
  }

}

