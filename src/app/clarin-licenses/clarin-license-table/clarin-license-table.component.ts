import { Component, OnInit } from '@angular/core';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { BehaviorSubject, combineLatest as observableCombineLatest } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { ClarinLicense } from '../../core/shared/clarin/clarin-license.model';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteData } from '../../core/shared/operators';
import { switchMap } from 'rxjs/operators';
import { PaginationService } from '../../core/pagination/pagination.service';
import { ClarinLicenseDataService } from '../../core/data/clarin/clarin-license-data.service';
import { defaultPagination, defaultSortConfiguration } from '../clarin-license-table-pagination';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefineLicenseFormComponent } from './modal/define-license-form/define-license-form.component';
import { DefineLicenseLabelFormComponent } from './modal/define-license-label-form/define-license-label-form.component';
import { ClarinLicenseConfirmationSerializer } from '../../core/shared/clarin/clarin-license-confirmation-serializer';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { isNull } from '../../shared/empty.util';
import { ClarinLicenseLabel } from '../../core/shared/clarin/clarin-license-label.model';
import { ClarinLicenseLabelDataService } from '../../core/data/clarin/clarin-license-label-data.service';
import { ClarinLicenseLabelExtendedSerializer } from '../../core/shared/clarin/clarin-license-label-extended-serializer';
import { ClarinLicenseRequiredInfoSerializer } from '../../core/shared/clarin/clarin-license-required-info-serializer';
import cloneDeep from 'lodash/cloneDeep';
import { RequestParam } from '../../core/cache/models/request-param.model';

/**
 * Component for managing clarin licenses and defining clarin license labels.
 */
@Component({
  selector: 'ds-clarin-license-table',
  templateUrl: './clarin-license-table.component.html',
  styleUrls: ['./clarin-license-table.component.scss']
})
export class ClarinLicenseTableComponent implements OnInit {

  constructor(private paginationService: PaginationService,
              private clarinLicenseService: ClarinLicenseDataService,
              private clarinLicenseLabelService: ClarinLicenseLabelDataService,
              private modalService: NgbModal,
              public activeModal: NgbActiveModal,
              private notificationService: NotificationsService,
              private translateService: TranslateService,) { }

  /**
   * The list of ClarinLicense object as BehaviorSubject object
   */
  licensesRD$: BehaviorSubject<RemoteData<PaginatedList<ClarinLicense>>> = new BehaviorSubject<RemoteData<PaginatedList<ClarinLicense>>>(null);

  /**
   * The pagination options
   * Start at page 1 and always use the set page size
   */
  options: PaginationComponentOptions;

  /**
   * The license which is currently selected, only one license could be selected
   */
  selectedLicense: ClarinLicense;

  /**
   * If the request isn't processed show the loading bar.
   */
  isLoading = false;

  /**
   * License name typed into search input field, it is passed to the BE as searching value.
   */
  searchingLicenseName = '';

  ngOnInit(): void {
    this.initializePaginationOptions();
    this.loadAllLicenses();
  }

  // define license
  /**
   * Pop up the License modal where the user fill in the License data.
   */
  openDefineLicenseForm() {
    const defineLicenseModalRef = this.modalService.open(DefineLicenseFormComponent);

    defineLicenseModalRef.result.then((result: ClarinLicense) => {
      this.defineNewLicense(result);
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Send create request to the API with the new License.
   * @param clarinLicense from the License modal.
   */
  defineNewLicense(clarinLicense: ClarinLicense) {
    const successfulMessageContentDef = 'clarin-license.define-license.notification.successful-content';
    const errorMessageContentDef = 'clarin-license.define-license.notification.error-content';
    if (isNull(clarinLicense)) {
      this.notifyOperationStatus(clarinLicense, successfulMessageContentDef, errorMessageContentDef);
    }

    // convert string value from the form to the number
    clarinLicense.confirmation = ClarinLicenseConfirmationSerializer.Serialize(clarinLicense.confirmation);
    // convert ClarinLicenseUserInfo.short the string value
    if (Array.isArray(clarinLicense.requiredInfo)) {
      clarinLicense.requiredInfo = ClarinLicenseRequiredInfoSerializer.Serialize(clarinLicense.requiredInfo);
    }

    this.clarinLicenseService.create(clarinLicense)
      .pipe(getFirstCompletedRemoteData())
      .subscribe((defineLicenseResponse: RemoteData<ClarinLicense>) => {
        // check payload and show error or successful
        this.notifyOperationStatus(defineLicenseResponse, successfulMessageContentDef, errorMessageContentDef);
        this.loadAllLicenses();
      });
  }

  // edit license
  /**
   * Pop up the License modal where the user fill in the License data. The modal is the same as the DefineLicenseForm.
   */
  openEditLicenseForm() {
    if (isNull(this.selectedLicense)) {
      return;
    }

    // pass the actual clarin license values to the define-clarin-license modal
    const editLicenseModalRef = this.modalService.open(DefineLicenseFormComponent);
    editLicenseModalRef.componentInstance.name = this.selectedLicense.name;
    editLicenseModalRef.componentInstance.definition = this.selectedLicense.definition;
    editLicenseModalRef.componentInstance.confirmation = this.selectedLicense.confirmation;
    editLicenseModalRef.componentInstance.requiredInfo = this.selectedLicense.requiredInfo;
    editLicenseModalRef.componentInstance.extendedClarinLicenseLabels =
      this.selectedLicense.extendedClarinLicenseLabels;
    editLicenseModalRef.componentInstance.clarinLicenseLabel =
      this.selectedLicense.clarinLicenseLabel;

    editLicenseModalRef.result.then((result: ClarinLicense) => {
      this.editLicense(result);
    });
  }

  /**
   * Send put request to the API with updated Clarin License.
   * @param clarinLicense from the License modal.
   */
  editLicense(clarinLicense: ClarinLicense) {
    const successfulMessageContentDef = 'clarin-license.edit-license.notification.successful-content';
    const errorMessageContentDef = 'clarin-license.edit-license.notification.error-content';
    if (isNull(clarinLicense)) {
      this.notifyOperationStatus(clarinLicense, successfulMessageContentDef, errorMessageContentDef);
    }

    const clarinLicenseObj = new ClarinLicense();
    clarinLicenseObj.name = clarinLicense.name;
    // @ts-ignore
    clarinLicenseObj.clarinLicenseLabel = this.ignoreIcon(clarinLicense.clarinLicenseLabel);
    // @ts-ignore
    clarinLicenseObj.extendedClarinLicenseLabels = this.ignoreIcon(clarinLicense.extendedClarinLicenseLabels);
    clarinLicenseObj._links = this.selectedLicense._links;
    clarinLicenseObj.id = clarinLicense.id;
    clarinLicenseObj.confirmation = clarinLicense.confirmation;
    // convert ClarinLicenseUserInfo.short the string value
    if (Array.isArray(clarinLicense.requiredInfo)) {
      clarinLicenseObj.requiredInfo = ClarinLicenseRequiredInfoSerializer.Serialize(clarinLicense.requiredInfo);
    }
    clarinLicenseObj.definition = clarinLicense.definition;
    clarinLicenseObj.bitstreams = clarinLicense.bitstreams;
    clarinLicenseObj.type = clarinLicense.type;

    this.clarinLicenseService.put(clarinLicenseObj)
      .pipe(getFirstCompletedRemoteData())
      .subscribe((editResponse: RemoteData<ClarinLicense>) => {
        // check payload and show error or successful
        this.notifyOperationStatus(editResponse, successfulMessageContentDef, errorMessageContentDef);
        this.loadAllLicenses();
      });
  }

  /**
   * When the Clarin License is editing ignore the Clarin License Label Icons - it throws error on BE, because the icon
   * is send as string not as byte array.
   * @param clarinLicenses
   */
  ignoreIcon(clarinLicenses: ClarinLicenseLabel | ClarinLicenseLabel[]) {
    const clarinLicenseUpdatable = cloneDeep(clarinLicenses);

    if (Array.isArray(clarinLicenseUpdatable)) {
      clarinLicenseUpdatable.forEach(clarinLicense => {
        clarinLicense.icon = [];
      });
    } else {
      clarinLicenseUpdatable.icon = [];
    }
    return clarinLicenseUpdatable;
  }

  // define license label
  /**
   * Pop up License Label modal where the user fill in the License Label data.
   */
  openDefineLicenseLabelForm() {
    const defineLicenseLabelModalRef = this.modalService.open(DefineLicenseLabelFormComponent);

    defineLicenseLabelModalRef.result.then((result: ClarinLicenseLabel) => {
      this.defineLicenseLabel(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Send create request to the API, the License Label icon is transformed to the byte array.
   * @param clarinLicenseLabel object from the License Label modal.
   */
  defineLicenseLabel(clarinLicenseLabel: ClarinLicenseLabel) {
    const successfulMessageContentDef = 'clarin-license-label.define-license-label.notification.successful-content';
    const errorMessageContentDef = 'clarin-license-label.define-license-label.notification.error-content';
    if (isNull(clarinLicenseLabel)) {
      this.notifyOperationStatus(clarinLicenseLabel, successfulMessageContentDef, errorMessageContentDef);
    }

    // convert file to the byte array
    const reader = new FileReader();
    const fileByteArray = [];

    try {
      reader.readAsArrayBuffer(clarinLicenseLabel.icon?.[0]);
    } catch (error) {
      // Cannot read any icon that means there is no icon
      // Create license label without icon
      this.createClarinLicenseLabel(clarinLicenseLabel, [], successfulMessageContentDef, errorMessageContentDef);
      return;
    }

    // Create license label with icon
    reader.onerror = (evt) => {
      this.notifyOperationStatus(null, successfulMessageContentDef, errorMessageContentDef);
    };
    reader.onloadend = (evt) => {
      if (evt.target.readyState === FileReader.DONE) {
        const arrayBuffer = evt.target.result;
        if (arrayBuffer instanceof ArrayBuffer) {
          const array = new Uint8Array(arrayBuffer);
          for (const item of array) {
            fileByteArray.push(item);
          }
        }
        this.createClarinLicenseLabel(clarinLicenseLabel, fileByteArray, successfulMessageContentDef, errorMessageContentDef);
      }
    };
  }

  /**
   * Call BE request to create a clarin license label with or without icon.
   * Show response in the notification popup.
   */
  createClarinLicenseLabel(clarinLicenseLabel: ClarinLicenseLabel, fileByteArray: any[] = [],
                           successfulMessageContentDef: any, errorMessageContentDef: any) {
    clarinLicenseLabel.icon = fileByteArray;
    // convert string value from the form to the boolean
    clarinLicenseLabel.extended = ClarinLicenseLabelExtendedSerializer.Serialize(clarinLicenseLabel.extended);

    // create
    this.clarinLicenseLabelService.create(clarinLicenseLabel)
      .pipe(getFirstCompletedRemoteData())
      .subscribe((defineLicenseLabelResponse: RemoteData<ClarinLicenseLabel>) => {
        // check payload and show error or successful
        this.notifyOperationStatus(defineLicenseLabelResponse, successfulMessageContentDef, errorMessageContentDef);
        this.loadAllLicenses();
      });
  }

  // delete license
  /**
   * Delete selected license. If none license is selected do nothing.
   */
  deleteLicense() {
    if (isNull(this.selectedLicense?.id)) {
      return;
    }
    this.clarinLicenseService.delete(String(this.selectedLicense.id))
      .pipe(getFirstCompletedRemoteData())
      .subscribe(deleteLicenseResponse => {
        const successfulMessageContentDef = 'clarin-license.delete-license.notification.successful-content';
        const errorMessageContentDef = 'clarin-license.delete-license.notification.error-content';
        this.notifyOperationStatus(deleteLicenseResponse, successfulMessageContentDef, errorMessageContentDef);
        this.loadAllLicenses();
      });
  }

  /**
   * Pop up the notification about the request success. Messages are loaded from the `en.json5`.
   * @param operationResponse current response
   * @param sucContent successful message name
   * @param errContent error message name
   */
  notifyOperationStatus(operationResponse, sucContent, errContent) {
    if (isNull(operationResponse)) {
      this.notificationService.error('', this.translateService.get(errContent));
      return;
    }

    if (operationResponse.hasSucceeded) {
      this.notificationService.success('',
        this.translateService.get(sucContent));
    } else if (operationResponse.isError) {
      this.notificationService.error('',
        this.translateService.get(errContent));
    }
  }

  /**
   * Update the page
   */
  onPageChange() {
    this.loadAllLicenses();
  }

  /**
   * Fetch all licenses from the API.
   */
  loadAllLicenses() {
    this.selectedLicense = null;

    this.licensesRD$ = new BehaviorSubject<RemoteData<PaginatedList<ClarinLicense>>>(null);
    this.isLoading = true;

    // load the current pagination and sorting options
    const currentPagination$ = this.paginationService.getCurrentPagination(this.options.id, this.options);
    const currentSort$ = this.paginationService.getCurrentSort(this.options.id, defaultSortConfiguration);

    observableCombineLatest([currentPagination$, currentSort$]).pipe(
      switchMap(([currentPagination, currentSort]) => {
        return this.clarinLicenseService.searchBy('byNameLike',{
            currentPage: currentPagination.currentPage,
            elementsPerPage: currentPagination.pageSize,
            sort: {field: currentSort.field, direction: currentSort.direction},
            searchParams: [Object.assign(new RequestParam('name', this.searchingLicenseName))]
          }, false
        );
      }),
      getFirstSucceededRemoteData()
    ).subscribe((res: RemoteData<PaginatedList<ClarinLicense>>) => {
      this.licensesRD$.next(res);
      this.isLoading = false;
    });
  }

  /**
   * Mark the license as selected or unselect if it is already clicked.
   * @param clarinLicense
   */
  switchSelectedLicense(clarinLicense: ClarinLicense) {
    if (isNull(clarinLicense)) {
      return;
    }

    if (this.selectedLicense?.id === clarinLicense?.id) {
      this.selectedLicense = null;
    } else {
      this.selectedLicense = clarinLicense;
    }
  }

  private initializePaginationOptions() {
    this.options = defaultPagination;
  }
}
