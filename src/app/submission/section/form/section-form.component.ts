import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';

import { Store } from '@ngrx/store';
import { DynamicFormControlEvent, DynamicFormControlModel } from '@ng-dynamic-forms/core';

import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../shared/form/form.component';
import { FormService } from '../../../shared/form/form.service';
import { SectionStatusChangeAction } from '../../objects/submission-objects.actions';
import { SectionModelComponent } from '../section.model';
import { SubmissionState } from '../../submission.reducers';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import { SubmissionFormsModel } from '../../../core/shared/config/config-submission-forms.model';
import { hasValue, isNotEmpty, isNotUndefined, isUndefined } from '../../../shared/empty.util';
import { ConfigData } from '../../../core/config/config-data';
import { CoreState } from '../../../core/core.reducers';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { submissionSectionDataFromIdSelector } from '../../selectors';
import { WorkspaceitemSectionFormObject } from '../../models/workspaceitem-section-form.model';
import { ConfigAuthorityModel } from '../../../core/shared/config/config-authority.model';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { IntegrationSearchOptions } from '../../../core/integration/models/integration-options.model';
import { AuthorityService } from '../../../core/integration/authority.service';
import { IntegrationData } from '../../../core/integration/integration-data';
import { WorkspaceitemSectionDataType } from '../../models/workspaceitem-sections.model';

@Component({
  selector: 'ds-submission-section-form',
  styleUrls: ['./section-form.component.scss'],
  templateUrl: './section-form.component.html',
})
export class FormSectionComponent extends SectionModelComponent {

  public formId;
  public formModel: DynamicFormControlModel[];
  public isLoading = true;
  public formRef: FormComponent;

  protected formConfig: SubmissionFormsModel;
  protected pathCombiner: JsonPatchOperationPathCombiner;

  @ViewChildren('formRef') private forms: QueryList<FormComponent>;

  constructor(protected authorityService: AuthorityService,
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
        this.formId = this.sectionData.id;
        this.formBuilderService.setAuthorityUuid(this.sectionData.collectionId);
        this.store.select(submissionSectionDataFromIdSelector(this.sectionData.submissionId, this.sectionData.id))
          .take(1)
          .subscribe((sectionData: WorkspaceitemSectionFormObject) => {
            if (isUndefined(sectionData) || Object.is(sectionData, this.sectionData.data)) {
              // Is the first loading so init form
              this.initForm(config, sectionData)
            } else if (!Object.is(sectionData, this.sectionData.data)) {
              // Data are changed from remote response so update form's values
              this.updateForm(sectionData);
            }
            this.isLoading = false;
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
              sectionData[index][0].value);

            this.authorityService.getEntriesByName(searchOptions)
              .subscribe((result: IntegrationData) => {
                if (hasValue(result.payload)) {
                  this.formService.setValue(this.formRef.formGroup, fieldModel, fieldId, result.payload);
                }
              })
          } else {
            this.formService.setValue(this.formRef.formGroup, fieldModel, fieldId, sectionData[index][0].value);
          }
        }
      })
  }

  subscriptions() {
    this.forms.changes
      .filter((comps: QueryList <FormComponent>) => hasValue(comps.first))
      .debounceTime(1)
      .subscribe((comps: QueryList <FormComponent>) => {
      if (isUndefined(this.formRef)) {
        this.formRef = comps.first;
        // this.formRef.formGroup.statusChanges
        this.formService.isValid(this.formRef.getFormUniqueId())
          .subscribe((formState) => {
            if (!hasValue(this.valid) || (hasValue(this.valid) && (this.valid !== this.formRef.formGroup.valid))) {
              this.valid = this.formRef.formGroup.valid;
              this.store.dispatch(new SectionStatusChangeAction(this.sectionData.submissionId, this.sectionData.id, this.valid));
            }
          });
      }
    });
  }

  onBlur(event) {}

  onChange(event: DynamicFormControlEvent) {
    this.operationsBuilder.replace(
      this.pathCombiner.getPath(this.formBuilderService.getFieldPathFromChangeEvent(event)),
      this.formBuilderService.getFieldValueFromChangeEvent(event));
  }

  onFocus(event) {}
}
