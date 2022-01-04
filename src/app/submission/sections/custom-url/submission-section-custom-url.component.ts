import { Component, Inject } from '@angular/core';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';
import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { SectionModelComponent } from '../models/section.model';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { isNotEmpty } from '../../../shared/empty.util';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { DynamicInputModel, DynamicFormControlEvent } from '@ng-dynamic-forms/core';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { WorkspaceitemSectionCustomUrlObject } from '../../../core/submission/models/workspaceitem-section-custom-url.model';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { environment } from '../../../../environments/environment';

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
   * Reference to NgbModal
   */
  formModel: any;

  frontendUrl: string = environment.ui.host + ':' + environment.ui.port;


  constructor(
    protected sectionService: SectionsService,
    // protected submissionCustomUrlDataService: SubmissionCcLicenseDataService,
    protected operationsBuilder: JsonPatchOperationsBuilder,
    private formBuilderService: FormBuilderService,
    protected formOperationsService: SectionFormOperationsService,
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
   */
  onSectionInit(): void {

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
          required: true,
          value: data.url
        })];

        this.submissionCustomUrl = data;
      })
    );
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

  onChange(event: DynamicFormControlEvent) {
    const path = this.formOperationsService.getFieldPathSegmentedFromChangeEvent(event);
    const value = this.formOperationsService.getFieldValueFromChangeEvent(event);
    this.operationsBuilder.replace(this.pathCombiner.getPath(path), value.value, true);
  }

}
