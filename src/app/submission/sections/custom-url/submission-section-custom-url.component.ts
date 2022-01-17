import { Component, Inject } from '@angular/core';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, take, tap } from 'rxjs/operators';
import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { SectionModelComponent } from '../models/section.model';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { isNotEmpty, hasValue } from '../../../shared/empty.util';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { DynamicInputModel, DynamicFormControlEvent, DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { WorkspaceitemSectionCustomUrlObject } from '../../../core/submission/models/workspaceitem-section-custom-url.model';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { SubmissionService } from '../../submission.service';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';

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
  private subscriptions: Subscription[] = [];

  /**
   * Cache of the available Creative Commons licenses.
   */
  submissionCustomUrl: WorkspaceitemSectionCustomUrlObject;


  /**
   * A list of all dynamic input models
   */
  formModel: DynamicFormControlModel[];

  /**
   * Full path of the item page
   */
  frontendUrl: string;

  /**
   * Represends if the section is used in the editItem Scope of submission
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
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }



  /**
   * Initialize the section.
   * Define if submission is in EditItem scope to allow user to manage redirect urls
   * Setup the full path of the url that will be seen by the users
   * Get current informations and build the form
   */
  onSectionInit(): void {
    this.setSubmissionScope();

    this.frontendUrl = new URLCombiner(window.location.origin, '/entities', encodeURIComponent(this.entityType.toLowerCase())).toString();
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);

    this.subscriptions.push(
      this.sectionService.getSectionState(this.submissionId, this.sectionData.id, SectionsType.CustomUrl).pipe(
        filter((sectionState) => {
          return isNotEmpty(sectionState) && (isNotEmpty(sectionState.data) || isNotEmpty(sectionState.errorsToShow));
        }),
        distinctUntilChanged(),
        map((sectionState) => sectionState.data as WorkspaceitemSectionCustomUrlObject),
      ).subscribe((data) => {
        this.formModel = [new DynamicInputModel({
          id: 'url',
          name: 'url',
          validators: {
            required: null,
          },
          required: false,
          value: data.url
        })];

        this.submissionCustomUrl = data;
        // Remove sealed object so we can remove urls from array
        if (hasValue(data['redirected-urls']) && isNotEmpty(data['redirected-urls'])) {
          this.redirectedUrls = [...data['redirected-urls']];
        } else {
          this.redirectedUrls = [];
        }
      })
    );
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
  getSectionStatus(): Observable<boolean> {
    return observableOf(true);
  }


  /**
   * When an information is changed build the formOperations
   * If the submission scope is in EditItem also manage redirected-urls formOperations
   */
  onChange(event: DynamicFormControlEvent): void {
    const path = this.formOperationsService.getFieldPathSegmentedFromChangeEvent(event);
    const value = this.formOperationsService.getFieldValueFromChangeEvent(event);
    this.operationsBuilder.replace(this.pathCombiner.getPath(path), value.value, true);
    if (this.isEditItemScope && hasValue(this.submissionCustomUrl.url)) {
      // Utilizing submissionCustomUrl.url as the last value saved we can add to the redirected-urls
      this.operationsBuilder.add(this.pathCombiner.getPath(['redirected-urls']), this.submissionCustomUrl.url, false, true);
    }
  }

  /**
   * When removing a redirected url build the formOperations
   */
  remove(i): void {
    this.operationsBuilder.remove(this.pathCombiner.getPath(['redirected-urls', i]));
    this.redirectedUrls.splice(i, 1);
  }

}
