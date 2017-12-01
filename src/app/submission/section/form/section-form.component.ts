import { Component, QueryList, ViewChildren } from '@angular/core';

import { isEmpty } from 'lodash';
import { Store } from '@ngrx/store';
import { DynamicFormControlEvent, DynamicFormControlModel } from '@ng-dynamic-forms/core';

import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../shared/form/form.component';
import { FormService } from '../../../shared/form/form.service';
import { SectionStatusChangeAction } from '../../objects/submission-objects.actions';
import { SectionModelComponent } from '../section.model';
import { SubmissionState } from '../../submission.reducers';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import { hasValue } from '../../../shared/empty.util';
import { ConfigData } from '../../../core/config/config-data';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { submissionSectionFromIdSelector } from '../../selectors';
import { SubmissionError, SubmissionSectionObject } from '../../objects/submission-objects.reducer';
import parseSectionErrorPaths from '../../utils/parseSectionErrorPaths';

@Component({
  selector: 'ds-submission-section-form',
  styleUrls: [ './section-form.component.scss' ],
  templateUrl: './section-form.component.html',
})
export class FormSectionComponent extends SectionModelComponent {

  public formId;
  public formModel: DynamicFormControlModel[];
  public isLoading = true;
  public formRef: FormComponent;

  protected pathCombiner: JsonPatchOperationPathCombiner;

  @ViewChildren('formRef') private forms: QueryList<FormComponent>;

  constructor(protected formBuilderService: FormBuilderService,
              protected formService: FormService,
              protected formConfigService: SubmissionFormsConfigService,
              protected operationsBuilder: JsonPatchOperationsBuilder,
              protected store: Store<SubmissionState>) {
    super();
  }

  ngOnInit() {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
    this.formConfigService.getConfigByHref(this.sectionData.config)
      .flatMap((config: ConfigData) => config.payload)
      .subscribe((config) => {
        this.formId = this.sectionData.id;
        this.formBuilderService.setAuthorityUuid(this.sectionData.collectionId);
        this.formModel = this.formBuilderService.modelFromConfiguration(config);
      });
  }

  ngAfterViewInit() {
    this.forms.changes.subscribe((comps: QueryList<FormComponent>) => {
      this.formRef = comps.first;

      // if form exists
      if (hasValue(this.formRef)) {

        this.formService.isValid(this.formRef.getFormUniqueId())
          .debounceTime(1)
          .subscribe((formState) => {
            this.isLoading = false;
            this.store.dispatch(new SectionStatusChangeAction(this.sectionData.submissionId, this.sectionData.id, formState));
          });

        /**
         * Subscribe to errors
         */
        this.store.select(submissionSectionFromIdSelector(this.sectionData.submissionId, this.sectionData.id))
          .subscribe((state: SubmissionSectionObject) => {
            const { errors } = state;

            if (errors && !isEmpty(errors)) {
              const { formId, formGroup } = this.formRef;
              const form = this.formBuilderService.getFormControlById(formId, formGroup, this.formModel);

              errors.forEach((errorItem: SubmissionError) => {
                const error = parseSectionErrorPaths(errorItem.path);

                console.log('FORMOSONE', error, form);
              });
            }
          })
      }
    });

  }

  onChange(event: DynamicFormControlEvent) {
    this.operationsBuilder.replace(
      this.pathCombiner.getPath(this.formBuilderService.getFieldPathFromChangeEvent(event)),
      this.formBuilderService.getFieldValueFromChangeEvent(event));
  }
}
