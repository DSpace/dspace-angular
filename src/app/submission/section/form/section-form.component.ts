import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { DynamicFormControlEvent, DynamicFormControlModel } from '@ng-dynamic-forms/core';

import { isEqual, findIndex } from 'lodash';

import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../shared/form/form.component';
import { FormService } from '../../../shared/form/form.service';
import {
  DeleteSectionErrorsAction,
  SectionStatusChangeAction,
} from '../../objects/submission-objects.actions';
import { SectionModelComponent } from '../section.model';
import { SubmissionState } from '../../submission.reducers';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import {
  hasValue,
  isNotEmpty,
  isNotUndefined,
  isUndefined
} from '../../../shared/empty.util';
import { ConfigData } from '../../../core/config/config-data';
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

import {
  COMBOBOX_METADATA_SUFFIX,
  COMBOBOX_VALUE_SUFFIX, DynamicComboboxModel
} from '../../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-combobox.model';
import { FormFieldPreviousValueObject } from '../../../shared/form/builder/models/form-field-previous-value-object';
import { FormAddError } from '../../../shared/form/form.actions';

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
  protected previousValue: FormFieldPreviousValueObject = new FormFieldPreviousValueObject();

  @ViewChild('formRef') private formRef: FormComponent;

  constructor(protected authorityService: AuthorityService,
              protected changeDetectorRef: ChangeDetectorRef,
              protected formBuilderService: FormBuilderService,
              protected formService: FormService,
              protected formConfigService: SubmissionFormsConfigService,
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
          .subscribe((sectionData: WorkspaceitemSectionFormObject) => {
            console.log(this.sectionData.id, this.sectionData.data);
            if (isUndefined(this.formModel)) {
              // Is the first loading so init form
              this.initForm(config, sectionData);
              this.subscriptions();
              this.isLoading = false;
              // this.changeDetectorRef.detectChanges();
            } else {
              if (!isEqual(sectionData, this.sectionData.data)) {
                // TODO send a notification to notify data may have been changed
                // Data are changed from remote response so update form's values
                /*this.isLoading = true;
                this.changeDetectorRef.detectChanges();
                this.formModel = null;*/
                // this.updateForm(sectionData);
                this.isLoading = true;
                setTimeout(() => {
                  // Reset the form
                  this.initForm(config, sectionData);
                  this.isLoading = false;
                }, 50);
                // this.changeDetectorRef.detectChanges();
              } else {
                this.isLoading = false;
              }
            }

          })

      });

  }

  initForm(config: SubmissionFormsModel, sectionData: WorkspaceitemSectionFormObject) {
    this.formModel = this.formBuilderService.modelFromConfiguration(config, sectionData);
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
                  const searchIndex = findIndex(result.payload, { value: sectionData[ index ][ 0 ].value });
                  this.formService.setValue(this.formRef.formGroup, fieldModel, fieldId, result.payload[searchIndex]);
                }
              })
          } else {
            this.formService.setValue(this.formRef.formGroup, fieldModel, fieldId, sectionData[ index ][ 0 ].value);
          }
        }
      });
    this.sectionData.data = sectionData;
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
      .filter((state: SubmissionSectionObject) => !!this.formRef && !!state && isNotEmpty(state.errors))
      .map((state: SubmissionSectionObject) => state.errors)
      .distinctUntilChanged()
      .subscribe((errors: SubmissionError[]) => {

        errors.forEach((error: SubmissionError) => {
          const errorPaths: SectionErrorPath[] = parseSectionErrorPaths(error.path);

          errorPaths.forEach((path: SectionErrorPath) => {
            if (path.fieldId) {
              const { formId } = this.formRef;
              const fieldId = path.fieldId.replace(/\./g, '_');

              // Dispatch action to the form state;
              const formAddErrorAction = new FormAddError(formId, fieldId, error.message);
              this.store.dispatch(formAddErrorAction);
            }
          });
        });

        // because errors has been shown, remove them form the state
        const removeAction = new DeleteSectionErrorsAction(this.submissionId, this.sectionData.id, errors);
        this.store.dispatch(removeAction);
      });
  }

  onAdd(event) {
    if (event.model instanceof DynamicComboboxModel) {
      console.log(event);
    }
  }

  onBlur(event) {
    // console.log('blur');
  }

  onChange(event: DynamicFormControlEvent) {
    this.formBuilderService.dispatchOperationsFromEvent(
      this.pathCombiner,
      event,
      this.previousValue,
      this.hasStoredValue(this.formBuilderService.getId(event.model)));
  }

  onFocus(event: DynamicFormControlEvent) {
    const value = this.formBuilderService.getFieldValueFromChangeEvent(event);
    const path = this.formBuilderService.getPath(event.model)
    if (event.model.id.endsWith(COMBOBOX_METADATA_SUFFIX) || event.model.id.endsWith(COMBOBOX_VALUE_SUFFIX)) {
      console.log('focus');
      this.previousValue.path = path;
      this.previousValue.value = this.formBuilderService.getComboboxMap(event);
    } else if (isNotEmpty(value)) {
      this.previousValue.path = path;
      this.previousValue.value = value;
    }
  }

  onRemove(event: DynamicFormControlEvent) {
    this.formBuilderService.dispatchOperationsFromEvent(
      this.pathCombiner,
      event,
      this.previousValue,
      this.hasStoredValue(this.formBuilderService.getId(event.model)));
  }

  hasStoredValue(fieldId) {
    if (isNotEmpty(this.sectionData.data)) {
      return this.sectionData.data.hasOwnProperty(fieldId);
    } else {
      return false;
    }
  }
}
