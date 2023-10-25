import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { DynamicFormControlEvent, DynamicFormControlModel, DynamicFormLayout } from '@ng-dynamic-forms/core';
import { Observable, Subscription } from 'rxjs';
import { SectionModelComponent } from '../models/section.model';
import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { FormComponent } from '../../../shared/form/form.component';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { FormService } from '../../../shared/form/form.service';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { SectionsService } from '../sections.service';
import { SubmissionService } from '../../submission.service';
import { TranslateService } from '@ngx-translate/core';
import { SectionDataObject } from '../models/section-data.model';

import { hasValue, isNotEmpty } from '../../../shared/empty.util';

import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { LdnServicesService } from '../../../admin/admin-ldn-services/ldn-services-data/ldn-services-data.service';
import { isLoading } from '../../../core/data/request-entry-state.model';
import { LdnService } from '../../../admin/admin-ldn-services/ldn-services-model/ldn-services.model';
import { SECTION_COAR_FORM_LAYOUT, SECTION_COAR_FORM_MODEL } from './section-coar-notify-model';
import {
  CoarNotifyConfigDataService
} from './coar-notify-config-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { SubmissionCoarNotifyConfig } from './submission-coar-notify.config';
import { FormFieldPreviousValueObject } from '../../../shared/form/builder/models/form-field-previous-value-object';
import { UntypedFormGroup } from '@angular/forms';
import { AlertType } from '../../../shared/alert/aletr-type';

export interface CoarNotifyDropdownSelector {
  ldnService: LdnService;
}

/**
 * This component represents a section that contains the submission section-coar-notify form.
 */
@Component({
  selector: 'ds-submission-section-coar-notify',
  templateUrl: './section-coar-notify.component.html',
  styleUrls: ['./section-coar-notify.component.scss']
})
@renderSectionFor(SectionsType.CoarNotify)

export class SubmissionSectionCoarNotifyComponent extends SectionModelComponent {

  requestReview: LdnService;
  requestEndorsement: LdnService;
  requestIngest: LdnService;

  coarNotifyConfigRD$: Observable<RemoteData<PaginatedList<SubmissionCoarNotifyConfig>>>;

  ldnServicesRD$: Observable<RemoteData<PaginatedList<LdnService>>>;


  patterns: string[] = [];
  selectedServices: { [key: string]: LdnService } = {};
  patternsLoaded = false;

  public AlertTypeEnum = AlertType;
  /**
   * The form model
   * @type {DynamicFormControlModel[]}
   */
  public formModel: DynamicFormControlModel[];
  /**
   * The form id
   * @type {string}
   */
  public formId: string;
  /**
   * The [[DynamicFormLayout]] object
   * @type {DynamicFormLayout}
   */
  public formLayout: DynamicFormLayout = SECTION_COAR_FORM_LAYOUT;
  /**
   * A FormGroup that combines all inputs
   */
  formGroup: UntypedFormGroup;
  /**
   * A boolean representing if div should start collapsed
   */
  public isCollapsed = false;
  protected readonly AlertType = AlertType;
  /**
   * The [[JsonPatchOperationPathCombiner]] object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected pathCombiner: JsonPatchOperationPathCombiner;
  /**
   * A map representing all field on their way to be removed
   * @type {Map}
   */
  protected fieldsOnTheirWayToBeRemoved: Map<string, number[]> = new Map();
  /**
   * The [FormFieldPreviousValueObject] object
   * @type {FormFieldPreviousValueObject}
   */
  protected previousValue: FormFieldPreviousValueObject = new FormFieldPreviousValueObject();
  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];
  protected readonly isLoading = isLoading;
  /**
   * The FormComponent reference
   */
  @ViewChild('formRef') private formRef: FormComponent;

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} changeDetectorRef
   * @param ldnServicesService
   * @param {CollectionDataService} collectionDataService
   * @param {FormBuilderService} formBuilderService
   * @param {SectionFormOperationsService} formOperationsService
   * @param {FormService} formService
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   * @param {SectionsService} sectionService
   * @param {SubmissionService} submissionService
   * @param {TranslateService} translateService
   * @param {CoarNotifyConfigDataService} coarNotifyConfigDataService
   * @param {string} injectedCollectionId
   * @param {SectionDataObject} injectedSectionData
   * @param {string} injectedSubmissionId
   */
  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected ldnServicesService: LdnServicesService,
              protected collectionDataService: CollectionDataService,
              protected formBuilderService: FormBuilderService,
              protected formOperationsService: SectionFormOperationsService,
              protected formService: FormService,
              protected operationsBuilder: JsonPatchOperationsBuilder,
              protected sectionService: SectionsService,
              protected submissionService: SubmissionService,
              protected translateService: TranslateService,
              protected coarNotifyConfigDataService: CoarNotifyConfigDataService,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  /**
   * Initialize all instance variables
   */
  onSectionInit() {
    this.formModel = this.formBuilderService.fromJSON(SECTION_COAR_FORM_MODEL);
    this.setCoarNotifyConfig();
    this.fetchLdnServices();
    this.coarNotifyConfigRD$.subscribe(data => {
      console.log(data);
    });
    this.ldnServicesRD$.subscribe(data => {
      console.log(data);
    });
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
  }

  /**
   * Method called when section is initialized
   * Retriev available NotifyConfigs
   */
  setCoarNotifyConfig() {
    this.coarNotifyConfigRD$ = this.coarNotifyConfigDataService.findAll().pipe(
        getFirstCompletedRemoteData()
    );

    this.coarNotifyConfigRD$.subscribe((data) => {
      if (data.hasSucceeded) {
        this.patterns = data.payload.page[0].patterns;
        this.patternsLoaded = true;
      }
    });
  }

  /**
   * Handle the customEvent (ex. drag-drop move event).
   * The customEvent is stored inside event.$event
   * @param event
   */
  onCustomEvent(event: DynamicFormControlEvent) {
    this.formOperationsService.dispatchOperationsFromEvent(
        this.pathCombiner,
        event,
        this.previousValue,
        null);
  }

  /**
   * Method called when a form dfChange event is fired.
   * Dispatch form operations based on changes.
   */
  onChange(event: DynamicFormControlEvent) {
    const path = this.formOperationsService.getFieldPathSegmentedFromChangeEvent(event);
    const value = this.formOperationsService.getFieldValueFromChangeEvent(event);
    if (value) {
      this.operationsBuilder.add(this.pathCombiner.getPath(path), value.value.toString(), false, true);
      this.sectionService.dispatchRemoveSectionErrors(this.submissionId, this.sectionData.id);
    } else {
      this.operationsBuilder.remove(this.pathCombiner.getPath(path));
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
   * Unsubscribe from all subscriptions
   */
  onSectionDestroy() {
    this.subs
        .filter((subscription) => hasValue(subscription))
        .forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Method called when section is initialized
   * Retriev available NotifyConfigs
   */
  fetchLdnServices() {
    this.ldnServicesRD$ = this.ldnServicesService.findAll().pipe(
        getFirstCompletedRemoteData()
    );

    this.ldnServicesRD$.subscribe((data) => {
      if (this.patternsLoaded) {
        this.patterns.forEach((pattern) => {
          this.selectedServices[pattern] = data.payload.page.find((service) =>
              this.hasInboundPattern(service, `Request ${pattern}`)
          );
        });
      }
    });
  }

  protected getSectionStatus(): Observable<boolean> {
    return undefined;
  }

  hasInboundPattern(service: any, patternType: string): boolean {
    return service.notifyServiceInboundPatterns.some(pattern => pattern.pattern === patternType);
  }
}
