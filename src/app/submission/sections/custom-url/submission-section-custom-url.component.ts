import { Component, Inject } from '@angular/core';
import { combineLatest as observableCombineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';
import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { SectionModelComponent } from '../models/section.model';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { DynamicFormControlEvent, DynamicFormControlModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { WorkspaceitemSectionCustomUrlObject } from '../../../core/submission/models/workspaceitem-section-custom-url.model';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { SubmissionService } from '../../submission.service';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';
import { SubmissionSectionError } from '../../objects/submission-section-error.model';
import { SubmissionSectionObject } from '../../objects/submission-section-object.model';
import { FormService } from '../../../shared/form/form.service';

/**
 * This component represents the submission section to select the Creative Commons license.
 */
@Component({
  selector: 'ds-submission-section-custom-url',
  templateUrl: './submission-section-custom-url.component.html',
  styleUrls: ['./submission-section-custom-url.component.scss']
})
@renderSectionFor(SectionsType.CustomUrl)
export class SubmissionSectionCustomUrlComponent extends SectionModelComponent {

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
  private subs: Subscription[] = [];

  /**
   * The current custom section data
   */
  customSectionData: WorkspaceitemSectionCustomUrlObject;

  /**
   * A list of all dynamic input models
   */
  formModel: DynamicFormControlModel[];

  /**
   * Full path of the item page
   */
  frontendUrl: string;

  /**
   * Represents if the section is used in the editItem Scope of submission
   */
  isEditItemScope = false;

  /**
   * Represents the list of redirected urls to be managed
   */
  redirectedUrls: string[] = [];

  constructor(
    protected sectionService: SectionsService,
    protected operationsBuilder: JsonPatchOperationsBuilder,
    protected formOperationsService: SectionFormOperationsService,
    protected formService: FormService,
    protected submissionService: SubmissionService,
    @Inject('entityType') public entityType: string,
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
   * Unsubscribe from all subscriptions
   */
  onSectionDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Initialize the section.
   * Define if submission is in EditItem scope to allow user to manage redirect urls
   * Setup the full path of the url that will be seen by the users
   * Get current information and build the form
   */
  onSectionInit(): void {
    this.formId = this.formService.getUniqueId(this.sectionData.id);
    this.setSubmissionScope();

    this.frontendUrl = new URLCombiner(window.location.origin, '/entities', encodeURIComponent(this.entityType.toLowerCase())).toString();
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);

    this.sectionService.getSectionState(this.submissionId, this.sectionData.id, SectionsType.CustomUrl).pipe(
      take(1)
    ).subscribe((state: SubmissionSectionObject) => {
      this.initForm(state.data as WorkspaceitemSectionCustomUrlObject);
      this.subscriptionOnSectionChange();
    });
  }

  setSubmissionScope() {
    if (this.submissionService.getSubmissionScope() === SubmissionScopeType.EditItem) {
      this.isEditItemScope = true;
    }
  }


  /**
   * Get section status
   *
   * @return Observable<boolean>
   *     the section status
   */
  protected getSectionStatus(): Observable<boolean> {
    const formStatus$ = this.formService.isValid(this.formId);
    const serverValidationStatus$ = this.sectionService.getSectionServerErrors(this.submissionId, this.sectionData.id).pipe(
      map((validationErrors) => isEmpty(validationErrors))
    );

    return observableCombineLatest([formStatus$, serverValidationStatus$]).pipe(
      map(([formValidation, serverSideValidation]: [boolean, boolean]) => {
        return isEmpty(this.customSectionData.url) || formValidation && serverSideValidation;
      })
    );
  }

  /**
   * Initialize form model
   *
   * @param sectionData
   *    the section data retrieved from the server
   */
  initForm(sectionData: WorkspaceitemSectionCustomUrlObject): void {
    this.formModel = [
      new DynamicInputModel({
        id: 'url',
        name: 'url',
        value: sectionData.url
      })
    ];
    this.updateSectionData(sectionData);
  }

  /**
   * When an information is changed build the formOperations
   * If the submission scope is in EditItem also manage redirected-urls formOperations
   */
  onChange(event: DynamicFormControlEvent): void {
    const path = this.formOperationsService.getFieldPathSegmentedFromChangeEvent(event);
    const metadataValue = this.formOperationsService.getFieldValueFromChangeEvent(event);
    this.operationsBuilder.replace(this.pathCombiner.getPath(path), metadataValue.value, true);

    if (isNotEmpty(metadataValue.value) && this.isEditItemScope && hasValue(this.customSectionData.url)) {
      // Utilizing submissionCustomUrl.url as the last value saved we can add to the redirected-urls
      this.operationsBuilder.add(this.pathCombiner.getPath(['redirected-urls']), this.customSectionData.url, false, true);
    }
  }

  /**
   * When removing a redirected url build the formOperations
   */
  remove(index: number): void {
    this.operationsBuilder.remove(this.pathCombiner.getPath(['redirected-urls', index.toString()]));
    this.redirectedUrls.splice(index, 1);
  }

  /**
   * Update section data
   *
   * @param sectionData
   */
  private updateSectionData(sectionData: WorkspaceitemSectionCustomUrlObject): void {
    this.customSectionData = sectionData;
    // Remove sealed object so we can remove urls from array
    if (hasValue(sectionData['redirected-urls']) && isNotEmpty(sectionData['redirected-urls'])) {
      this.redirectedUrls = [...sectionData['redirected-urls']];
    } else {
      this.redirectedUrls = [];
    }
  }

  private subscriptionOnSectionChange(): void {
    this.subs.push(
      this.sectionService.getSectionState(this.submissionId, this.sectionData.id, SectionsType.CustomUrl).pipe(
        filter((sectionState) => {
          return isNotEmpty(sectionState) && (isNotEmpty(sectionState.data) || isNotEmpty(sectionState.errorsToShow));
        }),
        distinctUntilChanged(),
      ).subscribe((state: SubmissionSectionObject) => {
        this.updateSectionData(state.data as WorkspaceitemSectionCustomUrlObject);
        const errors: SubmissionSectionError[] = state.errorsToShow;

        if (isNotEmpty(errors) || isNotEmpty(this.sectionData.errorsToShow)) {
          this.sectionService.checkSectionErrors(this.submissionId, this.sectionData.id, this.formId, errors, this.sectionData.errorsToShow);
          this.sectionData.errorsToShow = errors;
        }
      })
    );
  }
}
