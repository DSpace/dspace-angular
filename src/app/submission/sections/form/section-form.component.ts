import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { DynamicFormControlEvent, DynamicFormControlModel } from '@ng-dynamic-forms/core';

import { combineLatest as observableCombineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, find, flatMap, map, switchMap, take, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { isEqual } from 'lodash';

import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../shared/form/form.component';
import { FormService } from '../../../shared/form/form.service';
import { SectionModelComponent } from '../models/section.model';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import { hasNoValue, hasValue, isNotEmpty, isUndefined } from '../../../shared/empty.util';
import { ConfigData } from '../../../core/config/config-data';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { SubmissionFormsModel } from '../../../core/config/models/config-submission-forms.model';
import { SubmissionSectionError, SubmissionSectionObject } from '../../objects/submission-objects.reducer';
import { FormFieldPreviousValueObject } from '../../../shared/form/builder/models/form-field-previous-value-object';
import { GlobalConfig } from '../../../../config/global-config.interface';
import { SectionDataObject } from '../models/section-data.model';
import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { SubmissionService } from '../../submission.service';
import { SectionFormOperationsService } from './section-form-operations.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { SectionsService } from '../sections.service';
import { difference } from '../../../shared/object.util';
import { WorkspaceitemSectionFormObject } from '../../../core/submission/models/workspaceitem-section-form.model';
import { WorkspaceItem } from '../../../core/submission/models/workspaceitem.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../core/shared/operators';
import { SubmissionObject } from '../../../core/submission/models/submission-object.model';
import { SubmissionObjectDataService } from '../../../core/submission/submission-object-data.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { environment } from '../../../../environments/environment';

/**
 * This component represents a section that contains a Form.
 */
@Component({
  selector: 'ds-submission-section-form',
  styleUrls: ['./section-form.component.scss'],
  templateUrl: './section-form.component.html',
})
@renderSectionFor(SectionsType.SubmissionForm)
export class SubmissionSectionformComponent extends SectionModelComponent {

  /**
   * The form id
   * @type {string}
   */
  public formId: string;

  /**
   * The form model
   * @type {DynamicFormControlModel[]}
   */
  public formModel: DynamicFormControlModel[];

  /**
   * A boolean representing if this section is updating
   * @type {boolean}
   */
  public isUpdating = false;

  /**
   * A boolean representing if this section is loading
   * @type {boolean}
   */
  public isLoading = true;

  /**
   * A map representing all field on their way to be removed
   * @type {Map}
   */
  protected fieldsOnTheirWayToBeRemoved: Map<string, number[]> = new Map();

  /**
   * The form config
   * @type {SubmissionFormsModel}
   */
  protected formConfig: SubmissionFormsModel;

  /**
   * The form data
   * @type {any}
   */
  protected formData: any = Object.create({});

  /**
   * The [JsonPatchOperationPathCombiner] object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected pathCombiner: JsonPatchOperationPathCombiner;

  /**
   * The [FormFieldPreviousValueObject] object
   * @type {FormFieldPreviousValueObject}
   */
  protected previousValue: FormFieldPreviousValueObject = new FormFieldPreviousValueObject();

  /**
   * The list of Subscription
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  protected workspaceItem: WorkspaceItem;
  /**
   * The FormComponent reference
   */
  @ViewChild('formRef', {static: false}) private formRef: FormComponent;

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} cdr
   * @param {FormBuilderService} formBuilderService
   * @param {SectionFormOperationsService} formOperationsService
   * @param {FormService} formService
   * @param {SubmissionFormsConfigService} formConfigService
   * @param {NotificationsService} notificationsService
   * @param {SectionsService} sectionService
   * @param {SubmissionService} submissionService
   * @param {TranslateService} translate
   * @param {SubmissionObjectDataService} submissionObjectService
   * @param {ObjectCacheService} objectCache
   * @param {RequestService} requestService
   * @param {string} injectedCollectionId
   * @param {SectionDataObject} injectedSectionData
   * @param {string} injectedSubmissionId
   */
  constructor(protected cdr: ChangeDetectorRef,
              protected formBuilderService: FormBuilderService,
              protected formOperationsService: SectionFormOperationsService,
              protected formService: FormService,
              protected formConfigService: SubmissionFormsConfigService,
              protected notificationsService: NotificationsService,
              protected sectionService: SectionsService,
              protected submissionService: SubmissionService,
              protected translate: TranslateService,
              protected submissionObjectService: SubmissionObjectDataService,
              protected objectCache: ObjectCacheService,
              protected requestService: RequestService,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  /**
   * Initialize all instance variables and retrieve form configuration
   */
  onSectionInit() {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
    this.formId = this.formService.getUniqueId(this.sectionData.id);
    this.formConfigService.getConfigByHref(this.sectionData.config).pipe(
      map((configData: ConfigData) => configData.payload),
      tap((config: SubmissionFormsModel) => this.formConfig = config),
      flatMap(() =>
        observableCombineLatest(
          this.sectionService.getSectionData(this.submissionId, this.sectionData.id),
          this.submissionObjectService.getHrefByID(this.submissionId).pipe(take(1)).pipe(
            switchMap((href: string) => {
              this.objectCache.remove(href);
              this.requestService.removeByHrefSubstring(this.submissionId);
              return observableCombineLatest(
                this.objectCache.hasBySelfLinkObservable(href),
                this.requestService.hasByHrefObservable(href)
              ).pipe(
                filter(([existsInOC, existsInRC]) => !existsInOC && !existsInRC),
                take(1),
                switchMap(() => this.submissionObjectService.findById(this.submissionId, followLink('item')).pipe(getSucceededRemoteData(), getRemoteDataPayload()) as Observable<SubmissionObject>)
              )
            })
          )
        )),
      take(1))
      .subscribe(([sectionData, workspaceItem]: [WorkspaceitemSectionFormObject, WorkspaceItem]) => {
        if (isUndefined(this.formModel)) {
          this.sectionData.errors = [];
          this.workspaceItem = workspaceItem;
          // Is the first loading so init form
          this.initForm(sectionData);
          this.sectionData.data = sectionData;
          this.subscriptions();
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      })
  }

  /**
   * Unsubscribe from all subscriptions
   */
  onSectionDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Get section status
   *
   * @return Observable<boolean>
   *     the section status
   */
  protected getSectionStatus(): Observable<boolean> {
    return this.formService.isValid(this.formId);
  }

  /**
   * Check if the section data has been enriched by the server
   *
   * @param sectionData
   *    the section data retrieved from the server
   */
  hasMetadataEnrichment(sectionData: WorkspaceitemSectionFormObject): boolean {
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

  /**
   * Initialize form model
   *
   * @param sectionData
   *    the section data retrieved from the server
   */
  initForm(sectionData: WorkspaceitemSectionFormObject): void {
    try {
      this.formModel = this.formBuilderService.modelFromConfiguration(
        this.submissionId,
        this.formConfig,
        this.collectionId,
        sectionData,
        this.submissionService.getSubmissionScope()
      );
    } catch (e) {
      const msg: string = this.translate.instant('error.submission.sections.init-form-error') + e.toString();
      const sectionError: SubmissionSectionError = {
        message: msg,
        path: '/sections/' + this.sectionData.id
      };
      console.error(e.stack);
      this.sectionService.setSectionError(this.submissionId, this.sectionData.id, sectionError);
    }
  }

  /**
   * Update form model
   *
   * @param sectionData
   *    the section data retrieved from the server
   * @param errors
   *    the section errors retrieved from the server
   */
  updateForm(sectionData: WorkspaceitemSectionFormObject, errors: SubmissionSectionError[]): void {

    if (hasValue(sectionData) && !isEqual(sectionData, this.sectionData.data)) {
      this.sectionData.data = sectionData;
      this.isUpdating = true;
      this.formModel = null;
      this.cdr.detectChanges();
      this.initForm(sectionData);
      this.checksForErrors(errors);
      this.isUpdating = false;
      this.cdr.detectChanges();
    } else if (isNotEmpty(errors) || isNotEmpty(this.sectionData.errors)) {
      this.checksForErrors(errors);
    }

  }

  /**
   * Check if there are form validation error retrieved from server
   *
   * @param errors
   *    the section errors retrieved from the server
   */
  checksForErrors(errors: SubmissionSectionError[]): void {
    this.formService.isFormInitialized(this.formId).pipe(
      find((status: boolean) => status === true && !this.isUpdating))
      .subscribe(() => {
        this.sectionService.checkSectionErrors(this.submissionId, this.sectionData.id, this.formId, errors, this.sectionData.errors);
        this.sectionData.errors = errors;
        this.cdr.detectChanges();
      });
  }

  /**
   * Initialize all subscriptions
   */
  subscriptions(): void {
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
          this.fieldsOnTheirWayToBeRemoved = new Map();
          this.updateForm(sectionState.data as WorkspaceitemSectionFormObject, sectionState.errors);
        })
    )
  }

  /**
   * Method called when a form dfChange event is fired.
   * Dispatch form operations based on changes.
   *
   * @param event
   *    the [[DynamicFormControlEvent]] emitted
   */
  onChange(event: DynamicFormControlEvent): void {
    // don't handle change events for things with an index < 0, those are template rows.
    if (hasNoValue(event.context) || hasNoValue(event.context.index) || event.context.index >= 0) {
      this.formOperationsService.dispatchOperationsFromEvent(
        this.pathCombiner,
        event,
        this.previousValue,
        this.hasStoredValue(this.formBuilderService.getId(event.model), this.formOperationsService.getArrayIndexFromEvent(event)));
      const metadata = this.formOperationsService.getFieldPathSegmentedFromChangeEvent(event);
      const value = this.formOperationsService.getFieldValueFromChangeEvent(event);

      if (environment.submission.autosave.metadata.indexOf(metadata) !== -1 && isNotEmpty(value)) {
        this.submissionService.dispatchSave(this.submissionId);
      }
    }
  }

  /**
   * Method called when a form dfFocus event is fired.
   * Initialize [FormFieldPreviousValueObject] instance.
   *
   * @param event
   *    the [[DynamicFormControlEvent]] emitted
   */
  onFocus(event: DynamicFormControlEvent): void {
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

  /**
   * Method called when a form remove event is fired.
   * Dispatch form operations based on changes.
   *
   * @param event
   *    the [[DynamicFormControlEvent]] emitted
   */
  onRemove(event: DynamicFormControlEvent): void {
    const fieldId = this.formBuilderService.getId(event.model);
    const fieldIndex = this.formOperationsService.getArrayIndexFromEvent(event);

    // Keep track that this field will be removed
    if (this.fieldsOnTheirWayToBeRemoved.has(fieldId)) {
      const indexes = this.fieldsOnTheirWayToBeRemoved.get(fieldId);
      indexes.push(fieldIndex);
      this.fieldsOnTheirWayToBeRemoved.set(fieldId, indexes);
    } else {
      this.fieldsOnTheirWayToBeRemoved.set(fieldId, [fieldIndex]);
    }

    this.formOperationsService.dispatchOperationsFromEvent(
      this.pathCombiner,
      event,
      this.previousValue,
      this.hasStoredValue(fieldId, fieldIndex));

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
}
