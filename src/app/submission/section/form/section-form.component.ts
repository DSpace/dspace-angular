import { ChangeDetectorRef, Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { DynamicFormControlEvent, DynamicFormControlModel } from '@ng-dynamic-forms/core';

import { isEqual, isObject, transform } from 'lodash';

import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../shared/form/form.component';
import { FormService } from '../../../shared/form/form.service';
import { SaveSubmissionFormAction, SectionStatusChangeAction, } from '../../objects/submission-objects.actions';
import { SectionModelComponent } from '../section.model';
import { SubmissionState } from '../../submission.reducers';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import { hasValue, isNotEmpty, isNotUndefined, isUndefined } from '../../../shared/empty.util';
import { ConfigData } from '../../../core/config/config-data';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { submissionSectionDataFromIdSelector, submissionSectionFromIdSelector } from '../../selectors';
import { SubmissionFormsModel } from '../../../core/shared/config/config-submission-forms.model';
import { SubmissionSectionError, SubmissionSectionObject } from '../../objects/submission-objects.reducer';
import { FormFieldPreviousValueObject } from '../../../shared/form/builder/models/form-field-previous-value-object';
import { WorkspaceitemSectionDataType } from '../../../core/submission/models/workspaceitem-sections.model';
import { Subscription } from 'rxjs/Subscription';
import { GLOBAL_CONFIG } from '../../../../config';
import { GlobalConfig } from '../../../../config/global-config.interface';
import { SectionDataObject } from '../section-data.model';
import { renderSectionFor } from '../section-decorator';
import { SectionType } from '../section-type';
import { SubmissionService } from '../../submission.service';
import { FormOperationsService } from '../../../shared/form/form-operations.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { SectionService } from '../section.service';
import { difference } from '../../../shared/object.util';

@Component({
  selector: 'ds-submission-section-form',
  styleUrls: ['./section-form.component.scss'],
  templateUrl: './section-form.component.html',
})
@renderSectionFor(SectionType.SubmissionForm)
export class FormSectionComponent extends SectionModelComponent implements OnDestroy {

  public formId;
  public formModel: DynamicFormControlModel[];
  public isUpdating = false;
  public isLoading = true;

  protected formConfig: SubmissionFormsModel;
  protected formData: any = Object.create({});
  protected pathCombiner: JsonPatchOperationPathCombiner;
  protected previousValue: FormFieldPreviousValueObject = new FormFieldPreviousValueObject();
  protected subs: Subscription[] = [];

  @ViewChild('formRef') private formRef: FormComponent;

  constructor(protected cdr: ChangeDetectorRef,
              protected formBuilderService: FormBuilderService,
              protected formOperationsService: FormOperationsService,
              protected formService: FormService,
              protected formConfigService: SubmissionFormsConfigService,
              protected notificationsService: NotificationsService,
              protected store: Store<SubmissionState>,
              protected sectionService: SectionService,
              protected submissionService: SubmissionService,
              protected translate: TranslateService,
              @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  ngOnInit() {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
    this.formConfigService.getConfigByHref(this.sectionData.config)
      .flatMap((config: ConfigData) => config.payload)
      .subscribe((config: SubmissionFormsModel) => {
        this.formConfig = config;
        this.formId = this.formService.getUniqueId(this.sectionData.id);
        this.store.select(submissionSectionDataFromIdSelector(this.submissionId, this.sectionData.id))
          .take(1)
          .subscribe((sectionData: WorkspaceitemSectionDataType) => {
            if (isUndefined(this.formModel)) {
              this.sectionData.errors = [];
              // Is the first loading so init form
              this.initForm(sectionData);
              this.sectionData.data = sectionData;
              this.subscriptions();
              this.isLoading = false;
              this.cdr.detectChanges();
            }
          })
      });
  }

  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  initForm(sectionData: WorkspaceitemSectionDataType) {
    this.formModel = this.formBuilderService.modelFromConfiguration(
      this.formConfig,
      this.collectionId,
      sectionData,
      this.submissionService.getSubmissionScope());
  }

  updateForm(sectionData: WorkspaceitemSectionDataType, errors: SubmissionSectionError[]) {
    const diff = difference(sectionData, this.formData);
    if (isNotEmpty(sectionData) && !isEqual(sectionData, this.sectionData.data) && isNotEmpty(diff)) {
      this.notificationsService.info(null, this.translate.get('submission.sections.general.metadata_extracted'));
      this.isUpdating = true;
      this.formModel = null;
      this.cdr.detectChanges();
      this.formModel = this.formBuilderService.modelFromConfiguration(
        this.formConfig,
        this.collectionId,
        sectionData,
        this.submissionService.getSubmissionScope());
      this.checksForErrors(errors);
      this.sectionData.data = sectionData;
      this.isUpdating = false;
      this.cdr.detectChanges();
    } else if (isNotEmpty(errors)) {
      this.checksForErrors(errors);
    }

  }

  checksForErrors(errors: SubmissionSectionError[]) {
    this.formService.isFormInitialized(this.formId)
      .filter((status: boolean) => status === true && !this.isUpdating)
      .take(1)
      .subscribe(() => {
        this.sectionService.checkSectionErrors(this.submissionId, this.sectionData.id, this.formId, errors);
        this.sectionData.errors = errors;
        this.cdr.detectChanges();
      });
  }

  subscriptions() {
    this.subs.push(
      /**
       * Subscribe to form status
       */
      this.formService.isValid(this.formId)
        .filter((formValid) => isNotUndefined(formValid))
        .filter((formValid) => formValid !== this.valid)
        .subscribe((formState) => {
          this.valid = formState;
          this.store.dispatch(new SectionStatusChangeAction(this.submissionId, this.sectionData.id, this.valid));
        }),
      /**
       * Subscribe to form data
       */
      this.formService.getFormData(this.formId)
        .distinctUntilChanged()
        .subscribe((formData) => {
          this.formData = formData;
        }),
      /**
       * Subscribe to section state
       */
      this.store.select(submissionSectionFromIdSelector(this.submissionId, this.sectionData.id))
        .filter((sectionState: SubmissionSectionObject) => {
          return isNotEmpty(sectionState) && (isNotEmpty(sectionState.data) || isNotEmpty(sectionState.errors))
        })
        .distinctUntilChanged()
        .subscribe((sectionState: SubmissionSectionObject) => {
          this.updateForm(sectionState.data, sectionState.errors);
          // if (isNotEmpty(sectionState.data) || isNotEmpty(sectionState.errors)) {
          //   console.log(sectionState.data, sectionState.errors);
          //   this.updateForm(sectionState.data, sectionState.errors);
          // }
          // if (isNotEmpty(sectionState.data) && !isEqual(sectionState.data, this.sectionData.data)) {
          //   // Data are changed from remote response so update form's values
          //   // TODO send a notification to notify data may have been changed
          //   this.sectionData.data = sectionState.data;
          //   // this.isLoading = true;
          //   setTimeout(() => {
          //     // Reset the form
          //     this.updateForm(sectionState.data, sectionState.errors);
          //   }, 50);
          // } else if (isNotEmpty(sectionState.errors)) {
          //   this.checksForErrors(sectionState.errors);
          // }
        })
    )
  }

  onChange(event: DynamicFormControlEvent) {
    this.formOperationsService.dispatchOperationsFromEvent(
      this.pathCombiner,
      event,
      this.previousValue,
      this.hasStoredValue(this.formBuilderService.getId(event.model), this.formOperationsService.getArrayIndexFromEvent(event)));
    const metadata = this.formOperationsService.getFieldPathSegmentedFromChangeEvent(event);
    const value = this.formOperationsService.getFieldValueFromChangeEvent(event);

    if (this.EnvConfig.submission.autosave.metadata.indexOf(metadata) !== -1 && isNotEmpty(value)) {
      this.store.dispatch(new SaveSubmissionFormAction(this.submissionId));
    }
  }

  onFocus(event: DynamicFormControlEvent) {
    const value = this.formOperationsService.getFieldValueFromChangeEvent(event);
    const path = this.formBuilderService.getPath(event.model);
    if (this.formBuilderService.hasMappedGroupValue(event.model)) {
      this.previousValue.path = path;
      this.previousValue.value = this.formOperationsService.getComboboxMap(event);
    } else if (isNotEmpty(value) && ((typeof value === 'object' && isNotEmpty(value.value)) || (typeof value === 'string'))) {
      this.previousValue.path = path;
      this.previousValue.value = value;
    }
  }

  onRemove(event: DynamicFormControlEvent) {
    this.formOperationsService.dispatchOperationsFromEvent(
      this.pathCombiner,
      event,
      this.previousValue,
      this.hasStoredValue(this.formBuilderService.getId(event.model), this.formOperationsService.getArrayIndexFromEvent(event)));
  }

  hasStoredValue(fieldId, index) {
    if (isNotEmpty(this.sectionData.data) && isNotEmpty(this.sectionData.data[index])) {
      return this.sectionData.data.hasOwnProperty(fieldId);
    } else {
      return false;
    }
  }
}
