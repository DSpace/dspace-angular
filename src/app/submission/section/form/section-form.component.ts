import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';

import { isEmpty, uniqueId } from 'lodash';
import { Store } from '@ngrx/store';
import {
  DynamicFormArrayGroupModel, DynamicFormControlEvent, DynamicFormControlModel,
  DynamicFormGroupModel
} from '@ng-dynamic-forms/core';

import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../shared/form/form.component';
import { FormService } from '../../../shared/form/form.service';
import {
  DeleteSectionErrorAction,
  SectionStatusChangeAction,
} from '../../objects/submission-objects.actions';
import { SectionModelComponent } from '../section.model';
import { SubmissionState } from '../../submission.reducers';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import { hasValue, isNotEmpty, isNotUndefined, isUndefined } from '../../../shared/empty.util';
import { ConfigData } from '../../../core/config/config-data';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { submissionSectionDataFromIdSelector } from '../../selectors';
import { WorkspaceitemSectionFormObject } from '../../models/workspaceitem-section-form.model';
import { IntegrationSearchOptions } from '../../../core/integration/models/integration-options.model';
import { AuthorityService } from '../../../core/integration/authority.service';
import { IntegrationData } from '../../../core/integration/integration-data';
import { SubmissionFormsModel } from '../../../core/shared/config/config-submission-forms.model';
import { submissionSectionFromIdSelector } from '../../selectors';
import { SubmissionError, SubmissionSectionObject } from '../../objects/submission-objects.reducer';
import parseSectionErrorPaths, { SectionErrorPath } from '../../utils/parseSectionErrorPaths';
import { AbstractControl } from '@angular/forms';

import {
  COMBOBOX_METADATA_SUFFIX,
  COMBOBOX_VALUE_SUFFIX
} from '../../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-combobox.model';
import { isEqual } from 'lodash';

@Component({
  selector: 'ds-submission-section-form',
  styleUrls: [ './section-form.component.scss' ],
  templateUrl: './section-form.component.html',
})
export class FormSectionComponent extends SectionModelComponent {

  public formId;
  public formModel: DynamicFormControlModel[];
  public isLoading = true;

  protected formConfig: SubmissionFormsModel;
  protected pathCombiner: JsonPatchOperationPathCombiner;
  protected previousValue: { path: any[], value: string };

  @ViewChild('formRef') private formRef: FormComponent;

  constructor(protected authorityService: AuthorityService,
              protected changeDetectorRef: ChangeDetectorRef,
              protected formBuilderService: FormBuilderService,
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
      .subscribe((config: SubmissionFormsModel) => {
        this.formConfig = config;
        this.formId = this.formService.getUniqueId(this.sectionData.id);
        this.formBuilderService.setAuthorityUuid(this.collectionId);
        this.store.select(submissionSectionDataFromIdSelector(this.submissionId, this.sectionData.id))
          .take(1)
          .subscribe((sectionData: WorkspaceitemSectionFormObject) => {
            if (isUndefined(this.formModel)) {
              // Is the first loading so init form
              this.initForm(config, sectionData)
            } else if (!Object.is(sectionData, this.sectionData.data)) {
              // Data are changed from remote response so update form's values
              this.updateForm(sectionData);
            }
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();
          })

      });

  }

  initForm(config: SubmissionFormsModel, sectionData: WorkspaceitemSectionFormObject) {
    this.formModel = this.formBuilderService.modelFromConfiguration(config, sectionData);
    this.subscriptions();
  }

  updateForm(sectionData: WorkspaceitemSectionFormObject) {
    Object.keys(sectionData)
      .forEach((index) => {
        const fieldId = index.replace(/\./g, '_');
        const fieldModel: any = this.formBuilderService.findById(fieldId, this.formModel);
        if (isNotEmpty(fieldModel)) {
          if (this.formBuilderService.hasAuthorityValue(fieldModel)) {
            const searchOptions = new IntegrationSearchOptions(
              fieldModel.authorityScope,
              fieldModel.authorityName,
              index,
              sectionData[ index ][ 0 ].value);

            this.authorityService.getEntriesByName(searchOptions)
              .subscribe((result: IntegrationData) => {
                if (hasValue(result.payload)) {
                  this.formService.setValue(this.formRef.formGroup, fieldModel, fieldId, result.payload);
                }
              })
          } else {
            this.formService.setValue(this.formRef.formGroup, fieldModel, fieldId, sectionData[ index ][ 0 ].value);
          }
        }
      })
  }

  subscriptions() {
    this.formService.isValid(this.formId)
      .filter((formValid) => isNotUndefined(formValid))
      .filter((formValid) => formValid !== this.valid)
      .subscribe((formState) => {
        this.valid = formState;
        this.store.dispatch(new SectionStatusChangeAction(this.submissionId, this.sectionData.id, this.valid));
      });
    
    /**
     * Subscribe to form errors
     */
    this.store.select(submissionSectionFromIdSelector(this.submissionId, this.sectionData.id))
      .filter((state: SubmissionSectionObject) => !!this.formRef)
      .filter((state: SubmissionSectionObject) => !!state && isNotEmpty(state.errors))
      .map((state: SubmissionSectionObject) => state.errors)
      .filter((errors: SubmissionError[]) => !isEmpty(errors))
      .distinctUntilChanged()
      .subscribe((errors: SubmissionError[]) => {
        const { formGroup } = this.formRef;

        errors.forEach((errorItem: SubmissionError) => {
          const parsedErrors: SectionErrorPath[] = parseSectionErrorPaths(errorItem.path);

          // every error is related to a single field, but can contain multiple errors
          parsedErrors.forEach((parsedError: SectionErrorPath) => {

            // errors on fields
            if (parsedError.fieldId) {
              const parsedId = parsedError.fieldId.replace(/\./g, '_');
              const formControl: AbstractControl = this.formBuilderService.getFormControlById(parsedId, formGroup, this.formModel);
              const formControlModel: DynamicFormControlModel = this.formBuilderService.findById(parsedId, this.formModel);
              const errorKey = uniqueId('error-'); // create a single key for the error
              const error = {}; // create the error object

              error[ errorKey ] = errorItem.messageKey; // assign message

              // if form control model has errorMessages object, create it
              if (!formControlModel.errorMessages) {
                formControlModel.errorMessages = {};
              }

              // put the error in the for control model
              formControlModel.errorMessages[ errorKey ] = errorItem.messageKey;

              // add the error in the form control
              formControl.setErrors(error);

              // formGroup.markAsDirty();
              formControl.markAsTouched();

              // because it has been shown, remove the error from the state
              const removeAction = new DeleteSectionErrorAction(this.submissionId, this.sectionData.id, errorItem);
              this.store.dispatch(removeAction);
            }
          });
        });

        // after the cycles are over detectChanges();
        this.changeDetectorRef.detectChanges();
      });
  }

  onChange(event: DynamicFormControlEvent) {
    const path = this.formBuilderService.getFieldPathFromChangeEvent(event);
    const value = this.formBuilderService.getFieldValueFromChangeEvent(event);
    if (this.previousValue && isEqual(this.previousValue.path, this.formBuilderService.getPath(event.model))
      && event.model.id.endsWith(COMBOBOX_METADATA_SUFFIX) && this.previousValue.value !== event.control.value) {
      this.operationsBuilder.remove(this.pathCombiner.getPath(this.previousValue.value));
      this.previousValue = null;
    }

    if (event.model.parent instanceof DynamicFormArrayGroupModel
      || (event.model.parent instanceof DynamicFormGroupModel
        && isNotUndefined(event.model.parent.parent)
        && event.model.parent.parent instanceof DynamicFormArrayGroupModel)) {
      if (!event.model.id.endsWith(COMBOBOX_VALUE_SUFFIX) && event.context.index === 0) {
        this.operationsBuilder.add(
          this.pathCombiner.getPath(this.formBuilderService.getId(event.model)),
          value, false, true);
      } else {
        this.operationsBuilder.add(
          this.pathCombiner.getPath(path),
          value);
      }
    } else {
      if (this.hasStoredValue(this.formBuilderService.getId(event.model))) {
        this.operationsBuilder.replace(
          this.pathCombiner.getPath(path),
          value);
      } else {
        this.operationsBuilder.add(
          this.pathCombiner.getPath(path),
          value, false, true);
      }
    }
  }

  onFocus(event: DynamicFormControlEvent) {
    if (isNotEmpty(event.control.value)) {
      this.previousValue = {
        path: this.formBuilderService.getPath(event.model),
        value: event.control.value
      }
    }
  }

  onRemove(event: DynamicFormControlEvent) {
    const path = this.formBuilderService.getFieldPathFromChangeEvent(event);
    const value = this.formBuilderService.getFieldValueFromChangeEvent(event);
    if (isNotEmpty(value)) {
      this.operationsBuilder.remove(this.pathCombiner.getPath(path));
    }
  }

  hasStoredValue(fieldId) {
    if (isNotEmpty(this.sectionData.data)) {
      return this.sectionData.data.hasOwnProperty(fieldId);
    } else {
      return false;
    }
  }
}
