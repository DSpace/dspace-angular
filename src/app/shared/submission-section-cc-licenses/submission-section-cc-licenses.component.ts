import { Component, Inject } from '@angular/core';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { SubmissionCcLicence } from '../../core/shared/submission-cc-license.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../core/shared/operators';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { SubmissionCcLicensesDataService } from '../../core/data/submission-cc-licenses-data.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { renderSectionFor } from '../../submission/sections/sections-decorator';
import { SectionsType } from '../../submission/sections/sections-type';
import { SectionModelComponent } from '../../submission/sections/models/section.model';
import { SectionDataObject } from '../../submission/sections/models/section-data.model';
import { SectionsService } from '../../submission/sections/sections.service';
import { WorkspaceitemSectionCcLicenseObject } from '../../core/submission/models/workspaceitem-section-cc-license.model';
import { JsonPatchOperationPathCombiner } from '../../core/json-patch/builder/json-patch-operation-path-combiner';
import { isNotEmpty } from '../empty.util';

/**
 * This component represents the submission section to select the Creative Commons license.
 */
@Component({
  selector: 'ds-submission-section-cc-licenses',
  templateUrl: './submission-section-cc-licenses.component.html',
  styleUrls: ['./submission-section-cc-licenses.component.css']
})
@renderSectionFor(SectionsType.CcLicense)
export class SubmissionSectionCcLicensesComponent extends SectionModelComponent {

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
  submissionCcLicenses: SubmissionCcLicence[];

  /**
   * Reference to NgbModal
   */
  protected modalRef: NgbModalRef;

  constructor(
    protected modalService: NgbModal,
    protected sectionService: SectionsService,
    protected submissionCcLicensesDataService: SubmissionCcLicensesDataService,
    @Inject('collectionIdProvider') public injectedCollectionId: string,
    @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
    @Inject('submissionIdProvider') public injectedSubmissionId: string
  ) {
    super(
      injectedCollectionId,
      injectedSectionData,
      injectedSubmissionId,
    );
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
  select(ccLicense: SubmissionCcLicence) {
    if (!!this.getSelectedCcLicense() && this.getSelectedCcLicense().name === ccLicense.name) {
      return;
    }
    this.data.ccLicense = {
      name: ccLicense.name,
      fields: {},
    };
    this.updateSectionStatus();
  }

  /**
   * Get the selected Creative Commons license.
   */
  getSelectedCcLicense(): SubmissionCcLicence {
    if (!this.submissionCcLicenses || !this.data.ccLicense) {
      return null;
    }
    return this.submissionCcLicenses.filter((ccLicense) => ccLicense.name === this.data.ccLicense.name)[0];
  }

  /**
   * Select an option for a given license field.
   * @param ccLicense   the related Creative Commons license.
   * @param field       the field for which to select an option.
   * @param value       the value of the selected option,.
   */
  selectOption(ccLicense: SubmissionCcLicence, field: string, value: string) {

    this.data.ccLicense.fields[field] = value;
    this.updateSectionStatus();
  }

  /**
   * Get the selected option value for a given license field.
   * @param ccLicense   the related Creative Commons license.
   * @param field       the field for which to get the selected option value.
   */
  getSelectedOption(ccLicense: SubmissionCcLicence, field: string): string {
    return this.data.ccLicense.fields[field];
  }

  /**
   * Whether a given option value is selected for a given license field.
   * @param ccLicense   the related Creative Commons license.
   * @param field       the field for which to check whether the option is selected.
   * @param value       the value for which to check whether it is selected.
   */
  isSelectedOption(ccLicense: SubmissionCcLicence, field: string, value: string): boolean {
    return this.getSelectedOption(ccLicense, field) === value;
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
    return observableOf(
      !!this.getSelectedCcLicense() && this.getSelectedCcLicense().fields.every(
      (field) => !!this.getSelectedOption(this.getSelectedCcLicense(), field.id)
      )
    );
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
    this.subscriptions.push(
      this.sectionService.getSectionState(this.submissionId, this.sectionData.id).pipe(
        filter((sectionState) => {
          return isNotEmpty(sectionState) && (isNotEmpty(sectionState.data) || isNotEmpty(sectionState.errors))
        }),
        distinctUntilChanged(),
      ).subscribe((sectionState) => {
        this.sectionData.data = sectionState.data;
      }),
      this.submissionCcLicensesDataService.findAll({elementsPerPage: Number.MAX_SAFE_INTEGER}).pipe(
        getSucceededRemoteData(),
        getRemoteDataPayload(),
        map((list) => list.page),
      ).subscribe(
        (licenses) => this.submissionCcLicenses = licenses
      ),
    );
  }
}
