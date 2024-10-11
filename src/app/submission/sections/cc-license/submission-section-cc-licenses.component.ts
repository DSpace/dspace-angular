import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  take,
  tap,
} from 'rxjs/operators';

import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import {
  Field,
  Option,
  SubmissionCcLicence,
} from '../../../core/submission/models/submission-cc-license.model';
import { WorkspaceitemSectionCcLicenseObject } from '../../../core/submission/models/workspaceitem-section-cc-license.model';
import { SubmissionCcLicenseDataService } from '../../../core/submission/submission-cc-license-data.service';
import { SubmissionCcLicenseUrlDataService } from '../../../core/submission/submission-cc-license-url-data.service';
import { DsSelectComponent } from '../../../shared/ds-select/ds-select.component';
import {
  hasNoValue,
  hasValue,
  isNotEmpty,
} from '../../../shared/empty.util';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { VarDirective } from '../../../shared/utils/var.directive';
import { SectionModelComponent } from '../models/section.model';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { SectionsType } from '../sections-type';

/**
 * This component represents the submission section to select the Creative Commons license.
 */
@Component({
  selector: 'ds-submission-section-cc-licenses',
  templateUrl: './submission-section-cc-licenses.component.html',
  styleUrls: ['./submission-section-cc-licenses.component.scss'],
  imports: [
    AsyncPipe,
    DsSelectComponent,
    FormsModule,
    InfiniteScrollModule,
    NgbDropdownModule,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
export class SubmissionSectionCcLicensesComponent extends SectionModelComponent implements OnChanges, OnInit {

  /**
   * The form id
   * @type {string}
   */
  public formId: string;

  /**
   * A boolean representing if this section is loading
   * @type {boolean}
   */
  public isLoading = true;

  /**
   * The [JsonPatchOperationPathCombiner] object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected pathCombiner: JsonPatchOperationPathCombiner;

  /**
   * The list of Subscriptions this component subscribes to.
   */
  private subscriptions: Subscription[] = [];

  /**
   * Cache of the available Creative Commons licenses.
   */
  submissionCcLicenses: SubmissionCcLicence[] = [];

  /**
   * Reference to NgbModal
   */
  protected modalRef: NgbModalRef;

  /**
   * Default jurisdiction configured
   */
  defaultJurisdiction: string;

  /**
   * The currently selected cc licence
   */
  selectedCcLicense: SubmissionCcLicence = new SubmissionCcLicence();

  /**
   * Options for paginated data loading
   */
  ccLicenceOptions: FindListOptions = {
    elementsPerPage: 20,
    currentPage: 1,
  };
  /**
   * Check to stop paginated search
   *
   * @private
   */
  private _isLastPage: boolean;

  /**
   * The Creative Commons link saved in the workspace item.
   */
  get storedCcLicenseLink(): string {
    return this.data.uri;
  }

  /**
   * The accepted state for the selected Creative Commons license.
   */
  get accepted(): boolean {
    if (this.data.accepted === undefined) {
      return !!this.data.uri;
    }
    return this.data.accepted;
  }

  ccLicenseLink$: Observable<string>;

  constructor(
    protected modalService: NgbModal,
    protected sectionService: SectionsService,
    protected submissionCcLicensesDataService: SubmissionCcLicenseDataService,
    protected submissionCcLicenseUrlDataService: SubmissionCcLicenseUrlDataService,
    protected operationsBuilder: JsonPatchOperationsBuilder,
    protected configService: ConfigurationDataService,
    protected ref: ChangeDetectorRef,
    @Inject('collectionIdProvider') public injectedCollectionId: string,
    @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
    @Inject('submissionIdProvider') public injectedSubmissionId: string,
  ) {
    super(
      injectedCollectionId,
      injectedSectionData,
      injectedSubmissionId,
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (hasNoValue(this.ccLicenseLink$)) {
      this.ccLicenseLink$ = this.getCcLicenseLink$();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (hasValue(changes.sectionData) || hasValue(changes.submissionCcLicenses)) {
      this.ccLicenseLink$ = this.getCcLicenseLink$();
    }
  }

  /**
   * The data of this section.
   */
  get data(): WorkspaceitemSectionCcLicenseObject {
    return this.sectionData.data as WorkspaceitemSectionCcLicenseObject;
  }

  /**
   * Select a given Creative Commons license.
   * @param ccLicense the Creative Commons license to select.
   */
  selectCcLicense(ccLicense: SubmissionCcLicence) {
    if (this.selectedCcLicense.id === ccLicense.id) {
      return;
    }
    this.selectedCcLicense = ccLicense;
    this.setAccepted(false);
    this.updateSectionData({
      ccLicense: {
        id: ccLicense.id,
        fields: {},
      },
      uri: undefined,
    });
    this.ccLicenseLink$ = this.getCcLicenseLink$();
  }

  /**
   * Get the selected Creative Commons license.
   */
  getSelectedCcLicense(): SubmissionCcLicence {
    if (!this.submissionCcLicenses || !this.data.ccLicense) {
      return null;
    }
    return this.submissionCcLicenses.filter((ccLicense) => ccLicense.id === this.data.ccLicense.id)[0];
  }

  /**
   * Select an option for a given license field.
   * @param ccLicense   the related Creative Commons license.
   * @param field       the field for which to select an option.
   * @param option      the option to select.
   */
  selectOption(ccLicense: SubmissionCcLicence, field: Field, option: Option) {
    if (this.isSelectedOption(ccLicense, field, option)) {
      return;
    }
    this.updateSectionData({
      ccLicense: {
        id: ccLicense.id,
        fields: Object.assign({}, this.data.ccLicense.fields, {
          [field.id]: option,
        }),
      },
      accepted: false,
    });
    this.ccLicenseLink$ = this.getCcLicenseLink$();
  }

  /**
   * Get the selected option for a given license field.
   * @param ccLicense   the related Creative Commons license.
   * @param field       the field for which to get the selected option value.
   */
  getSelectedOption(ccLicense: SubmissionCcLicence, field: Field): Option {
    if (field.id === 'jurisdiction' && this.defaultJurisdiction !== undefined && this.defaultJurisdiction !== 'none') {
      return field.enums.find(option => option.id === this.defaultJurisdiction);
    }
    return this.data.ccLicense.fields[field.id];
  }

  /**
   * Whether a given option is selected for a given Creative Commons license field.
   * @param ccLicense   the related Creative Commons license.
   * @param field       the field for which to check whether the option is selected.
   * @param option      the option for which to check whether it is selected.
   */
  isSelectedOption(ccLicense: SubmissionCcLicence, field: Field, option: Option): boolean {
    return this.getSelectedOption(ccLicense, field) && this.getSelectedOption(ccLicense, field).id === option.id;
  }

  /**
   * Get the link to the Creative Commons license corresponding with the selected options.
   */
  getCcLicenseLink$(): Observable<string> {

    if (this.storedCcLicenseLink) {
      return of(this.storedCcLicenseLink);
    }
    if (!this.getSelectedCcLicense() || this.getSelectedCcLicense().fields.some(
      (field) => !this.getSelectedOption(this.getSelectedCcLicense(), field))) {
      return undefined;
    }
    const selectedCcLicense = this.getSelectedCcLicense();
    return this.submissionCcLicenseUrlDataService.getCcLicenseLink(
      selectedCcLicense,
      new Map(selectedCcLicense.fields.map(
        (field) => [field, this.getSelectedOption(selectedCcLicense, field)],
      )),
    );
  }

  /**
   * Open a given info modal.
   * @param content   the modal content.
   */
  openInfoModal(content) {
    this.modalRef = this.modalService.open(content);
  }

  /**
   * Close the info modal.
   */
  closeInfoModal() {
    this.modalRef.close();
  }

  /**
   * Get section status
   *
   * @return Observable<boolean>
   *     the section status
   */
  getSectionStatus(): Observable<boolean> {
    return of(this.accepted);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  onSectionDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Initialize the section.
   */
  onSectionInit(): void {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
    this.subscriptions.push(
      this.sectionService.getSectionState(this.submissionId, this.sectionData.id, SectionsType.CcLicense).pipe(
        filter((sectionState) => {
          return isNotEmpty(sectionState) && (isNotEmpty(sectionState.data) || isNotEmpty(sectionState.errorsToShow));
        }),
        distinctUntilChanged(),
        map((sectionState) => sectionState.data as WorkspaceitemSectionCcLicenseObject),
      ).subscribe((data) => {
        if (this.data.accepted !== data.accepted) {
          const path = this.pathCombiner.getPath('uri');
          if (data.accepted) {
            this.getCcLicenseLink$().pipe(
              take(1),
            ).subscribe((link) => {
              this.operationsBuilder.add(path, link.toString(), false, true);
            });
          } else if (this.data.uri) {
            this.operationsBuilder.remove(path);
          }
        }
        this.sectionData.data = data;
      }),
      this.configService.findByPropertyName('cc.license.jurisdiction').pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
      ).subscribe((remoteData) => {
        if (remoteData === undefined || remoteData.values.length === 0) {
          // No value configured, use blank value (International jurisdiction)
          this.defaultJurisdiction = '';
        } else {
          this.defaultJurisdiction = remoteData.values[0];
        }
      }),
    );
    this.loadCcLicences();
  }

  /**
   * Set the accepted state for the Creative Commons license.
   * @param accepted  the accepted state for the cc license.
   */
  setAccepted(accepted: boolean) {
    this.updateSectionData({
      accepted,
    });
    this.updateSectionStatus();
  }

  /**
   * Update the section data for this section.
   */
  updateSectionData(data: WorkspaceitemSectionCcLicenseObject) {
    this.sectionService.updateSectionData(this.submissionId, this.sectionData.id, Object.assign({}, this.data, data));
  }

  onScroll(event) {
    if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight) {
      if (!this.isLoading && !this._isLastPage) {
        this.ccLicenceOptions.currentPage++;
        this.loadCcLicences();
      }
    }
  }

  loadCcLicences() {
    this.isLoading = true;

    this.subscriptions.push(
      this.submissionCcLicensesDataService.findAll(this.ccLicenceOptions).pipe(
        getFirstSucceededRemoteDataPayload(),
        tap((response) => this._isLastPage = response.pageInfo.currentPage === response.pageInfo.totalPages),
        map((list) => list.page),
      ).subscribe(
        (licenses) => {
          this.submissionCcLicenses = [...this.submissionCcLicenses, ...licenses];
          this.isLoading = false;
          this.ref.detectChanges();
        },
      ),
    );
  }
}
