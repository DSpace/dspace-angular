import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { DynamicFormControlEvent, DynamicFormControlModel } from '@ng-dynamic-forms/core';

import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, take, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { isEqual } from 'lodash';

import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../shared/form/form.component';
import { FormService } from '../../../shared/form/form.service';
import { SectionModelComponent } from '../models/section.model';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import { hasValue, isNotEmpty, isUndefined } from '../../../shared/empty.util';
import { ConfigData } from '../../../core/config/config-data';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { SubmissionFormsModel } from '../../../core/config/models/config-submission-forms.model';
import { SubmissionSectionError, SubmissionSectionObject } from '../../objects/submission-objects.reducer';
import { FormFieldPreviousValueObject } from '../../../shared/form/builder/models/form-field-previous-value-object';
import { WorkspaceitemSectionDataType } from '../../../core/submission/models/workspaceitem-sections.model';
import { GLOBAL_CONFIG } from '../../../../config';
import { GlobalConfig } from '../../../../config/global-config.interface';
import { SectionDataObject } from '../models/section-data.model';
import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { SubmissionService } from '../../submission.service';
import { FormOperationsService } from './form-operations.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { SectionsService } from '../sections.service';
import { difference } from '../../../shared/object.util';

@Component({
  selector: 'ds-submission-section-form',
  styleUrls: ['./section-form.component.scss'],
  templateUrl: './section-form.component.html',
})
@renderSectionFor(SectionsType.SubmissionForm)
export class FormSectionComponent extends SectionModelComponent {

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
              protected sectionService: SectionsService,
              protected submissionService: SubmissionService,
              protected translate: TranslateService,
              @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  onSectionInit() {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
    this.formId = this.formService.getUniqueId(this.sectionData.id);

    this.formConfigService.getConfigByHref(this.sectionData.config).pipe(
      map((configData: ConfigData) => configData.payload),
      tap((config: SubmissionFormsModel) => this.formConfig = config),
      flatMap(() => this.sectionService.getSectionData(this.submissionId, this.sectionData.id)),
      take(1))
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
  }

  onSectionDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  protected getSectionStatus(): Observable<boolean> {
    return this.formService.isValid(this.formId);
  }

  hasMetadataEnrichment(sectionData): boolean {
    const diffResult = [];

    // compare current form data state with section data retrieved from store
    const diffObj = difference(sectionData, this.formData);

    // iterate over differences to check whether they are actually different
    Object.keys(diffObj)
      .forEach((key) => {
        diffObj[key].forEach((value) => {
          if (value.hasOwnProperty('value')) {
            diffResult.push(value);
          }
        });
      });
    return isNotEmpty(diffResult);
  }

  initForm(sectionData: WorkspaceitemSectionDataType) {
    try {
      this.formModel = this.formBuilderService.modelFromConfiguration(
        this.formConfig,
        this.collectionId,
        sectionData,
        this.submissionService.getSubmissionScope());
    } catch (e) {
      this.translate.get('error.submission.sections.init-form-error')
        .subscribe((msg) => {
          const sectionError: SubmissionSectionError = {
            message: msg + e.toString(),
            path: '/sections/' + this.sectionData.id
          };
          this.sectionService.setSectionError(this.submissionId, this.sectionData.id, sectionError);
        })

    }
  }

  updateForm(sectionData: WorkspaceitemSectionDataType, errors: SubmissionSectionError[]) {

    if (isNotEmpty(sectionData) && !isEqual(sectionData, this.sectionData.data) && this.hasMetadataEnrichment(sectionData)) {
      this.translate.get('submission.sections.general.metadata-extracted', {sectionId: this.sectionData.id})
        .pipe(take(1))
        .subscribe((m) => {
          this.notificationsService.info(null, m, null, true);
        });
      this.isUpdating = true;
      this.formModel = null;
      this.cdr.detectChanges();
      this.initForm(sectionData);
      this.checksForErrors(errors);
      this.sectionData.data = sectionData;
      this.isUpdating = false;
      this.cdr.detectChanges();
    } else if (isNotEmpty(errors) || isNotEmpty(this.sectionData.errors)) {
      this.checksForErrors(errors);
    }

  }

  checksForErrors(errors: SubmissionSectionError[]) {
    this.formService.isFormInitialized(this.formId).pipe(
      filter((status: boolean) => status === true && !this.isUpdating),
      take(1))
      .subscribe(() => {
        this.sectionService.checkSectionErrors(this.submissionId, this.sectionData.id, this.formId, errors, this.sectionData.errors);
        this.sectionData.errors = errors;
        this.cdr.detectChanges();
      });
  }

  subscriptions() {
    this.subs.push(

      /**
       * Subscribe to form's data
       */
      this.formService.getFormData(this.formId).pipe(
        distinctUntilChanged())
        .subscribe((formData) => {
          this.formData = formData;
        }),
      /**
       * Subscribe to section state
       */
      this.sectionService.getSectionState(this.submissionId, this.sectionData.id).pipe(
        filter((sectionState: SubmissionSectionObject) => {
          return isNotEmpty(sectionState) && (isNotEmpty(sectionState.data) || isNotEmpty(sectionState.errors))
        }),
        distinctUntilChanged())
        .subscribe((sectionState: SubmissionSectionObject) => {
          this.updateForm(sectionState.data, sectionState.errors);
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
      this.submissionService.dispatchSave(this.submissionId);
    }
  }

  onFocus(event: DynamicFormControlEvent) {
    const value = this.formOperationsService.getFieldValueFromChangeEvent(event);
    const path = this.formBuilderService.getPath(event.model);
    if (this.formBuilderService.hasMappedGroupValue(event.model)) {
      this.previousValue.path = path;
      this.previousValue.value = this.formOperationsService.getQualdropValueMap(event);
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
    if (isNotEmpty(this.sectionData.data)) {
      return this.sectionData.data.hasOwnProperty(fieldId) && isNotEmpty(this.sectionData.data[fieldId][index]);
    } else {
      return false;
    }
  }
}
