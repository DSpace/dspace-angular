import { SectionAccessesService } from './section-accesses.service';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild } from '@angular/core';
import { renderSectionFor } from 'src/app/submission/sections/sections-decorator';
import { SectionsType } from 'src/app/submission/sections/sections-type';
import { SubmissionService } from 'src/app/submission/submission.service';
import { SectionDataObject } from 'src/app/submission/sections/models/section-data.model';
import { SectionsService } from 'src/app/submission/sections/sections.service';
import { SectionModelComponent } from 'src/app/submission/sections/models/section.model';
import { Observable, of, Subscription, combineLatest as observableCombineLatest, BehaviorSubject, combineLatest } from 'rxjs';
import { DynamicFormControlModel, MATCH_ENABLED, OR_OPERATOR, DynamicSelectModel, DynamicDatePickerModel, DynamicFormGroupModel, DynamicFormArrayModel, DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER, DynamicCheckboxModel, DynamicFormControlEvent } from '@ng-dynamic-forms/core';
import { FormBuilderService } from 'src/app/shared/form/builder/form-builder.service';
import { findIndex, isEqual } from 'lodash';

import {
  ACCESS_CONDITION_GROUP_CONFIG,
  ACCESS_CONDITION_GROUP_LAYOUT,
  ACCESS_CONDITIONS_FORM_ARRAY_CONFIG,
  ACCESS_CONDITIONS_FORM_ARRAY_LAYOUT,
  FORM_ACCESS_CONDITION_END_DATE_CONFIG,
  FORM_ACCESS_CONDITION_END_DATE_LAYOUT,
  FORM_ACCESS_CONDITION_START_DATE_CONFIG,
  FORM_ACCESS_CONDITION_START_DATE_LAYOUT,
  FORM_ACCESS_CONDITION_TYPE_CONFIG,
  FORM_ACCESS_CONDITION_TYPE_LAYOUT,
  ACCESS_FORM_CHECKBOX_LAYOUT
} from './section-accesses.model';
import { isNotEmpty, isNotUndefined, isUndefined, hasValue, isNotNull } from 'src/app/shared/empty.util';
import { WorkspaceitemSectionAccessesObject } from '../../../core/submission/models/workspaceitem-section-accesses.model';
import { SubmissionAccessesConfigService } from 'src/app/core/config/submission-accesses-config.service';
import { getFirstSucceededRemoteData } from 'src/app/core/shared/operators';
import { map, take, filter, mergeMap } from 'rxjs/operators';
import { FormComponent } from 'src/app/shared/form/form.component';
import { FormService } from 'src/app/shared/form/form.service';
import { JsonPatchOperationPathCombiner } from 'src/app/core/json-patch/builder/json-patch-operation-path-combiner';
import { SectionFormOperationsService } from 'src/app/submission/sections/form/section-form-operations.service';
import { JsonPatchOperationsBuilder } from 'src/app/core/json-patch/builder/json-patch-operations-builder';
import { AccessesConditionOption } from 'src/app/core/config/models/config-accesses-conditions-options.model';
import { TranslateService } from '@ngx-translate/core';
import { FormFieldPreviousValueObject } from 'src/app/shared/form/builder/models/form-field-previous-value-object';
import { environment } from 'src/environments/environment';
import { SubmissionObject } from 'src/app/core/submission/models/submission-object.model';
import { SubmissionJsonPatchOperationsService } from 'src/app/core/submission/submission-json-patch-operations.service';
import { dateToISOFormat } from 'src/app/shared/date.util';

@Component({
  selector: 'ds-section-accesses',
  templateUrl: './section-accesses.component.html',
  styleUrls: ['./section-accesses.component.scss']
})
@renderSectionFor(SectionsType.AccessesCondition)
export class SubmissionSectionAccessesComponent extends SectionModelComponent {

  /**
   * The FormComponent reference
   */
  @ViewChild('formRef') public formRef: FormComponent;

  /**
   * List of available access conditions that could be set to files
   */
  public availableAccessConditionOptions: AccessesConditionOption[];  // List of accessConditions that an user can select

  /**
   * The form id
   * @type {string}
   */
  public formId: string;

  /**
   * The accesses metadata data
   * @type {WorkspaceitemSectionAccessesObject}
   */
  public accessesData: WorkspaceitemSectionAccessesObject;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];


  /**
   * The collection name this submission belonging to
   * @type {string}
   */
  public collectionName: string;

  /**
   * Is the upload required
   * @type {boolean}
   */
  public required$ = new BehaviorSubject<boolean>(true);

  /**
   * The [[JsonPatchOperationPathCombiner]] object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected pathCombiner: JsonPatchOperationPathCombiner;

  /**
   * A map representing all field prevous values
   * @type {Map}
   */
  protected previousValue: Map<string, number[]> = new Map();

  /**
   * A map representing all field on their way to be removed
   * @type {Map}
   */
  protected fieldsOnTheirWayToBeRemoved: Map<string, number[]> = new Map();

  /**
   * The form model
   * @type {DynamicFormControlModel[]}
   */
  formModel: DynamicFormControlModel[];

  /**
   * Initialize instance variables
   *
   * @param {SectionsService} sectionService
   * @param {SectionDataObject} injectedSectionData
   * @param {FormService} formService
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   * @param {SectionFormOperationsService} formOperationsService
   * @param {FormBuilderService} formBuilderService
   * @param {SubmissionAccessesConfigService} accessesConfigService
   * @param {SectionAccessesService} accessesService
   * @param {SubmissionJsonPatchOperationsService} operationsService
   * @param {string} injectedSubmissionId
   */
  constructor(
    protected sectionService: SectionsService,
    private formBuilderService: FormBuilderService,
    private accessesConfigService: SubmissionAccessesConfigService,
    private accessesService: SectionAccessesService,
    protected formOperationsService: SectionFormOperationsService,
    protected operationsBuilder: JsonPatchOperationsBuilder,
    private formService: FormService,
    private translate: TranslateService,
    private operationsService: SubmissionJsonPatchOperationsService,
    @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
    @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(undefined, injectedSectionData, injectedSubmissionId);
  }

  /**
   * Initialize all instance variables and retrieve collection default access conditions
   */
  protected onSectionInit(): void {

    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
    this.formId = this.formService.getUniqueId(this.sectionData.id);
    const config$ = this.accessesConfigService.findByHref(this.sectionData.config, true, false).pipe(
      getFirstSucceededRemoteData(),
      map((config) => config.payload),
    );

    const accessData$ = this.accessesService.getAccessesData(this.submissionId, this.sectionData.id);

    combineLatest(config$, accessData$).subscribe(([config, accessData]) => {
      this.availableAccessConditionOptions = isNotEmpty(config.accessConditionOptions) ? config.accessConditionOptions : [];
      this.accessesData = accessData;
      this.formModel = this.buildFileEditForm();
    });


  }

  /**
   * Get section status
   *
   * @return Observable<boolean>
   *     the section status
   */
  protected getSectionStatus(): Observable<boolean> {
    console.log('Method not implemented.');
    return of(true);
  }

  /**
   * Initialize form model
   */
  protected buildFileEditForm() {

    const formModel: DynamicFormControlModel[] = [];
    formModel.push(
      new DynamicCheckboxModel({
        id: 'discoverable',
        label: this.translate.instant('submission.sections.accesses.form.discoverable-label'),
        name: 'discoverable',
        value: this.accessesData.discoverable
      })
    );

    const accessConditionTypeModelConfig = Object.assign({}, FORM_ACCESS_CONDITION_TYPE_CONFIG);
    const accessConditionsArrayConfig = Object.assign({}, ACCESS_CONDITIONS_FORM_ARRAY_CONFIG);
    const accessConditionTypeOptions = [];

    for (const accessCondition of this.availableAccessConditionOptions) {
      accessConditionTypeOptions.push(
        {
          label: accessCondition.name,
          value: accessCondition.name
        }
      );
    }
    accessConditionTypeModelConfig.options = accessConditionTypeOptions;

    // Dynamically assign of relation in config. For startdate, endDate, groups.
    const hasStart = [];
    const hasEnd = [];
    const hasGroups = [];
    this.availableAccessConditionOptions.forEach((condition) => {
      const showStart: boolean = condition.hasStartDate === true;
      const showEnd: boolean = condition.hasEndDate === true;
      const showGroups: boolean = showStart || showEnd;
      if (showStart) {
        hasStart.push({ id: 'name', value: condition.name });
      }
      if (showEnd) {
        hasEnd.push({ id: 'name', value: condition.name });
      }
      if (showGroups) {
        hasGroups.push({ id: 'name', value: condition.name });
      }
    });
    const confStart = { relations: [{ match: MATCH_ENABLED, operator: OR_OPERATOR, when: hasStart }] };
    const confEnd = { relations: [{ match: MATCH_ENABLED, operator: OR_OPERATOR, when: hasEnd }] };

    accessConditionsArrayConfig.groupFactory = () => {
      const type = new DynamicSelectModel(accessConditionTypeModelConfig, FORM_ACCESS_CONDITION_TYPE_LAYOUT);
      const startDateConfig = Object.assign({}, FORM_ACCESS_CONDITION_START_DATE_CONFIG, confStart);
      const endDateConfig = Object.assign({}, FORM_ACCESS_CONDITION_END_DATE_CONFIG, confEnd);

      const startDate = new DynamicDatePickerModel(startDateConfig, FORM_ACCESS_CONDITION_START_DATE_LAYOUT);
      const endDate = new DynamicDatePickerModel(endDateConfig, FORM_ACCESS_CONDITION_END_DATE_LAYOUT);
      const accessConditionGroupConfig = Object.assign({}, ACCESS_CONDITION_GROUP_CONFIG);
      accessConditionGroupConfig.group = [type];
      if (hasStart.length > 0) { accessConditionGroupConfig.group.push(startDate); }
      if (hasEnd.length > 0) { accessConditionGroupConfig.group.push(endDate); }
      return [new DynamicFormGroupModel(accessConditionGroupConfig, ACCESS_CONDITION_GROUP_LAYOUT)];
    };

    // Number of access conditions blocks in form
    accessConditionsArrayConfig.initialCount = isNotEmpty(this.accessesData.accessConditions) ? this.accessesData.accessConditions.length : 1;
    formModel.push(
      new DynamicFormArrayModel(accessConditionsArrayConfig, ACCESS_CONDITIONS_FORM_ARRAY_LAYOUT)
    );

    this.initModelData(formModel);
    return formModel;
  }

  /**
   * Initialize form model values
   *
   * @param formModel
   *    The form model
   */
  public initModelData(formModel: DynamicFormControlModel[]) {
    this.accessesData.accessConditions.forEach((accessCondition, index) => {
      Array.of('name', 'startDate', 'endDate')
        .filter((key) => accessCondition.hasOwnProperty(key) && isNotEmpty(accessCondition[key]))
        .forEach((key) => {
          const metadataModel: any = this.formBuilderService.findById(key, formModel, index);
          if (metadataModel) {
            if (metadataModel.type === DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER) {
              const date = new Date(accessCondition[key]);
              metadataModel.value = {
                year: date.getUTCFullYear(),
                month: date.getUTCMonth() + 1,
                day: date.getUTCDate()
              };
            } else {
              metadataModel.value = accessCondition[key];
            }
          }
        });
    });
  }

  onSubmit() {
    // this.formService.validateAllFormFields(this.formRef.formGroup);
  }

  /**
   * Method called when a form dfChange event is fired.
   * Dispatch form operations based on changes.
   */
  onChange(event: DynamicFormControlEvent) {
    if (event.model.type === 'CHECKBOX') {
      const path = this.formOperationsService.getFieldPathSegmentedFromChangeEvent(event);
      const value = this.formOperationsService.getFieldValueFromChangeEvent(event);
      this.operationsBuilder.replace(this.pathCombiner.getPath(path), value.value, true);
    } else {
      // validate form
      this.formService.validateAllFormFields(this.formRef.formGroup);
      this.formService.isValid(this.formId).pipe(
        take(1),
        filter((isValid) => isValid),
        mergeMap(() => this.formService.getFormData(this.formId)),
        take(1),
        mergeMap((formData: any) => {
          console.log(formData);
          const accessConditionsToSave = [];
          formData.accessCondition
            .map((accessConditions) => accessConditions.accessConditionGroup)
            .filter((accessCondition) => isNotEmpty(accessCondition))
            .forEach((accessCondition) => {
              let accessConditionOpt;

              this.availableAccessConditionOptions
                .filter((element) => isNotNull(accessCondition.name) && element.name === accessCondition.name[0].value)
                .forEach((element) => accessConditionOpt = element);

              if (accessConditionOpt) {
                const currentAccessCondition = Object.assign({}, accessCondition);
                currentAccessCondition.name = this.retrieveValueFromField(accessCondition.name);

                /* When start and end date fields are deactivated, their values may be still present in formData,
                therefore it is necessary to delete them if they're not allowed by the current access condition option. */
                if (!accessConditionOpt.hasStartDate) {
                  delete currentAccessCondition.startDate;
                } else if (accessCondition.startDate) {
                  const startDate = this.retrieveValueFromField(accessCondition.startDate);
                  currentAccessCondition.startDate = dateToISOFormat(startDate);
                }
                if (!accessConditionOpt.hasEndDate) {
                  delete currentAccessCondition.endDate;
                } else if (accessCondition.endDate) {
                  const endDate = this.retrieveValueFromField(accessCondition.endDate);
                  currentAccessCondition.endDate = dateToISOFormat(endDate);
                }
                accessConditionsToSave.push(currentAccessCondition);
              }
            });

          this.operationsBuilder.add(this.pathCombiner.getPath('accessConditions'), accessConditionsToSave, true);

          return this.formService.getFormData(this.formId);

        })
      ).subscribe((result: SubmissionObject[]) => {
        console.log(result);
      });
    }
  }

  protected retrieveValueFromField(field: any) {
    const temp = Array.isArray(field) ? field[0] : field;
    return (temp) ? temp.value : undefined;
  }
  /**
   * Check if the specified form field has already a value stored
   *
   * @param fieldId
   *    the section data retrieved from the serverù
   * @param index
   *    the section data retrieved from the server
   */
  hasStoredValue(fieldId, index): boolean {
    if (isNotEmpty(this.sectionData.data)) {
      return this.sectionData.data.hasOwnProperty(fieldId) &&
        isNotEmpty(this.sectionData.data[fieldId][index]) &&
        !this.isFieldToRemove(fieldId, index);
    } else {
      return false;
    }
  }

  private hasRelatedCustomError(medatata): boolean {
    const index = findIndex(this.sectionData.errorsToShow, { path: this.pathCombiner.getPath(medatata).path });
    if (index !== -1) {
      const error = this.sectionData.errorsToShow[index];
      const validator = error.message.replace('error.validation.', '');
      return !environment.form.validatorMap.hasOwnProperty(validator);
    } else {
      return false;
    }
  }

  /**
   * Check if the specified field is on the way to be removed
   *
   * @param fieldId
   *    the section data retrieved from the serverù
   * @param index
   *    the section data retrieved from the server
   */
  isFieldToRemove(fieldId, index) {
    return this.fieldsOnTheirWayToBeRemoved.has(fieldId) && this.fieldsOnTheirWayToBeRemoved.get(fieldId).includes(index);
  }


  /**
   * Unsubscribe from all subscriptions
   */
  onSectionDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
