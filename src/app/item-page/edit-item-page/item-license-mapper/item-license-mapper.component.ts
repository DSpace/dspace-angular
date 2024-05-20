import { Component, OnInit } from '@angular/core';
import { map, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClarinLicenseDataService } from '../../../core/data/clarin/clarin-license-data.service';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteListPayload } from '../../../core/shared/operators';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { ClarinLicense } from '../../../core/shared/clarin/clarin-license.model';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { PutRequest } from '../../../core/data/request.models';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { RequestService } from '../../../core/data/request.service';
import { hasFailed } from '../../../core/data/request-entry-state.model';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { getItemPageRoute } from '../../item-page-routing-paths';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { getLicensesManageTablePath, getLicensesModulePath } from '../../../app-routing-paths';
import { isNull } from '../../../shared/empty.util';

@Component({
  selector: 'ds-item-license-mapper',
  templateUrl: './item-license-mapper.component.html',
  styleUrls: ['./item-license-mapper.component.scss']
})
export class ItemLicenseMapperComponent implements OnInit {
  // Import methods for resolving the `license/manage-table` path
  protected readonly getLicensesModulePath = getLicensesModulePath;
  protected readonly getLicensesManageTablePath = getLicensesManageTablePath;

  /**
   * The current license of the item. It is automatically updated when the item's license is changed and successfully
   * updated.
   */
  currentLicense: BehaviorSubject<ClarinLicense> = new BehaviorSubject(null);

  /**
   * All licenses available in the system.
   */
  allLicenses: BehaviorSubject<ClarinLicense[]> = new BehaviorSubject<ClarinLicense[]>([]);

  /**
   * The selected license id to attach to the item.
   */
  selectedLicenseId: number = null;

  /**
   * The current item UUID.
   */
  currentItemUUID: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private clarinLicenseService: ClarinLicenseDataService,
              private halService: HALEndpointService,
              private requestService: RequestService,
              private rdbService: RemoteDataBuildService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService) {
  }

  /**
   * The item to attach/detach a license to
   */
  itemRD$: Observable<RemoteData<Item>>;
    ngOnInit(): void {
      this.itemRD$ = this.route.parent.data.pipe(
        take(1),
        map((data) => data.dso),
      );

      this.itemRD$.pipe(
        take(1))
        .subscribe((itemRD) => {
        this.currentItemUUID = itemRD.payload.uuid;
      });

      this.loadCurrentLicense();
      this.loadAllLicenses();
    }

  /**
   * Load all licenses from the server and set them to allLicenses.
   * @private
   */
  private loadAllLicenses() {
      const options = new FindListOptions();
      options.currentPage = 0;
      // Load all licenses
      options.elementsPerPage = 1000;

      this.clarinLicenseService.findAll(options, false)
        .pipe(
          getFirstSucceededRemoteListPayload(),
        ).subscribe((licenses) => {
        this.allLicenses.next(licenses);
      });
    }

    /**
     * Load current license from item metadata and set it to currentLicense.
     */
    private loadCurrentLicense() {
      let licenseName: string;

      // Fetch Item's license
      this.itemRD$.subscribe((itemRD) => {
        licenseName = itemRD.payload.firstMetadataValue('dc.rights');
      });

      // Create request options - add license name to search params
      const options = {
        searchParams: [
          {
            fieldName: 'name',
            fieldValue: licenseName
          }
        ]
      };

      // Fetch license by name and set it to currentLicense
      this.clarinLicenseService.searchBy('byName', options, false)
        .pipe(
          getFirstCompletedRemoteData(),
          switchMap((clList: RemoteData<PaginatedList<ClarinLicense>>) => clList?.payload?.page),
        ).subscribe((license) => {
        this.currentLicense.next(license);
      });
    }

  removeLicense() {
    this.selectedLicenseId = null;
    this.currentLicense.next(null);
  }

  /**
   * Update item's metadata and bitstream with new license and show notification on success/failure.
   */
  updateLicense() {
    if (isNull(this.currentLicense.value) && isNull(this.selectedLicenseId)) {
      // Update bitstream license with none license - just detach license. `-1` is a special value for no license.
      this.sendUpdateRequest(-1);
    } else {
      // Update bitstream license with new license - detach old license and attach a new license.
      this.sendUpdateRequest(this.selectedLicenseId);
    }
  }

  /**
   * Redirect to Item Page
   */
  return() {
    this.itemRD$.subscribe((itemRD) => {
      const itemUrl = getItemPageRoute(itemRD.payload);
      void this.router.navigateByUrl(itemUrl);
    });
  }

  /**
   * Send PUT request to update item's license. Show notification on success/failure.
   * @param licenseId
   * @private
   */
  private sendUpdateRequest(licenseId) {
    // Compose URL: /core/items/{itemUUID}/bundles?licenseID={licenseID}
    let url = this.halService.getRootHref() + '/core/items/' + this.currentItemUUID + '/bundles?licenseID=' + licenseId;
    const requestId = this.requestService.generateRequestId();
    const putRequest = new PutRequest(requestId, url);
    // call put request
    this.requestService.send(putRequest);

    // Process response
    const response = this.rdbService.buildFromRequestUUID(requestId);
    response
      .pipe(getFirstCompletedRemoteData())
      .subscribe((responseRD$: RemoteData<Item>) => {
        if (hasFailed(responseRD$.state)) {
          this.notificationsService.error(null, this.translateService.instant('item.edit.license.update.error'));
          return;
        }
        // Update current license after successfully request
        this.currentLicense.next(this.allLicenses.value.find(
          (license) => String(license.id) === String(licenseId)));
        this.notificationsService.success(null, this.translateService.instant('item.edit.license.update.success'));
      });
  }
}
