import { NgClass } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SubmissionFormsModel } from '@dspace/core/config/models/config-submission-forms.model';
import { PLACEHOLDER_PARENT_METADATA } from '@dspace/core/shared/form/ds-dynamic-form-constants';
import { FormFieldMetadataValueObject } from '@dspace/core/shared/form/models/form-field-metadata-value.model';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core/shared/operators';
import { MetadataSecurityConfiguration } from '@dspace/core/submission/models/metadata-security-configuration';
import { Vocabulary } from '@dspace/core/submission/vocabularies/models/vocabulary.model';
import { VocabularyEntry } from '@dspace/core/submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyOptions } from '@dspace/core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyService } from '@dspace/core/submission/vocabularies/vocabulary.service';
import {
  hasValue,
  isNotEmpty,
  isNotNull,
} from '@dspace/shared/utils/empty.util';
import {
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormControlComponent,
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  Subscription,
} from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { BtnDisabledDirective } from 'src/app/shared/btn-disabled.directive';

import { SubmissionService } from '../../../../../../../submission/submission.service';
import { shrinkInOut } from '../../../../../../animations/shrink';
import { FormComponent } from '../../../../../form.component';
import { FormService } from '../../../../../form.service';
import { FormBuilderService } from '../../../../form-builder.service';
import { DsDynamicInputModel } from '../../ds-dynamic-input.model';
import { DynamicRelationGroupModel } from '../dynamic-relation-group.model';

/**
 * Modal component for managing relation group fields in submission forms.
 *
 * This component displays a modal dialog that allows users to add or edit grouped metadata fields,
 * such as author information with multiple related fields (name, affiliation, etc.).
 * It's used in submission workflows where metadata fields need to be grouped together logically.
 */
@Component({
  selector: 'ds-dynamic-relation-group-modal',
  styleUrls: ['../dynamic-relation-group.component.scss'],
  templateUrl: './dynamic-relation-group-modal.component.html',
  animations: [shrinkInOut],
  imports: [
    BtnDisabledDirective,
    FormComponent,
    NgClass,
    TranslateModule,
  ],
})
export class DsDynamicRelationGroupModalComponent extends DynamicFormControlComponent implements OnDestroy, OnInit {

  /**
   * Unique identifier for the form instance
   */
  @Input() formId: string;

  /**
   * The reactive FormGroup instance containing the form controls
   */
  @Input() group: FormGroup;

  /**
   * The dynamic model configuration for this relation group
   */
  @Input() model: DynamicRelationGroupModel;

  /**
   * Optional existing item data when editing (null when adding new)
   */
  @Input() item: any;

  /**
   * Index of the item being edited in the parent collection
   */
  @Input() itemIndex: number;

  /**
   * Whether the security has been changed
   */
  @Input() changedSecurity: boolean;

  /**
   * Config for metadata security toggle
   */
  @Input() metadataSecurityConfiguration: MetadataSecurityConfiguration;

  /**
   * Current value of the relation group
   */
  @Input() value: any;

  /**
   * Event emitted when a form field loses focus
   */
  @Output() blur: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Event emitted when a form value changes
   */
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Event emitted when a form field receives focus
   */
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Event emitted when editing an existing chip item
   */
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Event emitted when adding a new chip item
   */
  @Output() add: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Reference to the child FormComponent for accessing form state
   */
  @ViewChild('formRef', { static: false }) private formRef: FormComponent;

  /**
   * Array of dynamic form control models representing the fields in this group
   */
  public formModel: DynamicFormControlModel[];

  /**
   * Observable stream of the vocabulary configuration for autocomplete functionality
   */
  public vocabulary$: Observable<Vocabulary>;

  /**
   * Security level of the parent model
   */
  public securityLevelParent: number;

  /**
   * Array of subscriptions to be cleaned up on component destruction
   */
  private subs: Subscription[] = [];

  /**
   * Creates an instance of DsDynamicRelationGroupModalComponent.
   *
   * @param vocabularyService Service for retrieving controlled vocabulary data
   * @param formBuilderService Service for constructing dynamic form models
   * @param formService Service for form validation and management
   * @param cdr Angular change detector reference for manual change detection
   * @param layoutService Service for managing form layout
   * @param validationService Service for form validation
   * @param modalService NgBootstrap modal service
   * @param submissionService Service for managing submission state
   * @param activeModal Reference to the active modal instance for closing
   */
  constructor(private vocabularyService: VocabularyService,
    private formBuilderService: FormBuilderService,
    private formService: FormService,
    private cdr: ChangeDetectorRef,
    protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService,
    protected modalService: NgbModal,
    protected submissionService: SubmissionService,
    private activeModal: NgbActiveModal,
  ) {
    super(layoutService, validationService);
  }

  /**
   * Initializes the component on creation.
   */
  ngOnInit() {
    const config = { rows: this.model.formConfiguration } as SubmissionFormsModel;
    this.formId = this.formService.getUniqueId(this.model.id);
    this.formModel = this.formBuilderService.modelFromConfiguration(
      this.model.submissionId,
      config,
      this.model.scopeUUID,
      {},
      this.model.submissionScope,
      this.model.readOnly,
      null,
      true,
      this.metadataSecurityConfiguration);
    this.formBuilderService.addFormModel(this.formId, this.formModel);
    if (this.item) {
      this.formModel.forEach((row) => {
        const modelRow = row as DynamicFormGroupModel;
        modelRow.group.forEach((model: DsDynamicInputModel) => {
          const value = (this.item[model.name] === PLACEHOLDER_PARENT_METADATA
            || this.item[model.name].value === PLACEHOLDER_PARENT_METADATA)
            ? null
            : this.item[model.name];
          const nextValue = (this.formBuilderService.isInputModel(model) && isNotNull(value) && (typeof value !== 'string')) ?
            value.value : value;
          if (isNotEmpty(nextValue)) {
            model.value = nextValue;
            if (isNotEmpty(nextValue?.language)) {
              model.language = nextValue.language;
            }
          }

          this.initSecurityLevelConfig(model, modelRow);
        });
      });
    }
    const mandatoryFieldModel = this.getMandatoryFieldModel();
    if (mandatoryFieldModel.vocabularyOptions && isNotEmpty(mandatoryFieldModel.vocabularyOptions.name)) {
      this.retrieveVocabulary(mandatoryFieldModel.vocabularyOptions);
    }

  }

  /**
   * Gets the header text for the modal.
   *
   * @returns The label of the mandatory field to be used as the modal header
   */
  getHeader() {
    return this.getMandatoryFieldModel().label;
  }

  /**
   * Checks if any mandatory field in the form is empty.
   *
   * This validation ensures that all required fields have values before
   * allowing the user to save the chip item.
   *
   * @returns True if any mandatory field is empty, false otherwise
   */
  isMandatoryFieldEmpty() {
    const models = this.getMandatoryFields();
    return models.some(model => !model.value);
  }

  /**
   * Checks if the mandatory field has an authority value.
   *
   * Authority values are used for external integrations and controlled
   * vocabularies to link metadata to external authority sources.
   *
   * @returns True if the mandatory field has an authority value, false otherwise
   */
  hasMandatoryFieldAuthority() {
    const model = this.getMandatoryFieldModel();
    return hasValue(model.value)
      && typeof model.value === 'object'
      && (model.value as any).hasAuthority();
  }

  /**
   * Handles blur events from form fields.
   *
   * @param event The blur event object
   */
  onBlur(event) {
    this.blur.emit();
  }

  /**
   * Handles focus events from form fields.
   *
   * @param event The focus event object
   */
  onFocus(event) {
    this.focus.emit(event);
  }

  /**
   * Saves the current form data.
   *
   * This method determines whether to add a new chip item or modify an existing one
   * based on whether the `item` input is set. After saving, it closes the modal.
   */
  save() {
    if (this.item) {
      this.modifyChip();
    } else {
      this.addToChips();
    }
    this.closeModal();
  }

  /**
   * Determines if the current item can be imported from an external source.
   *
   * @returns True if import functionality should be available, false otherwise
   */
  canImport() {
    return !this.isMandatoryFieldEmpty() && this.item && !this.hasMandatoryFieldAuthority();
  }

  /**
   * Closes the modal dialog.
   *
   * This triggers the modal's close event, which the parent component
   * can listen to for cleanup or state management.
   */
  closeModal() {
    this.activeModal.close();
  }

  /**
   * Updates the authority value for the mandatory field.
   *
   * This method is typically called when importing metadata from an external source.
   * It preserves the current field value and language while adding the authority identifier.
   * After updating, it saves the modified chip and triggers a submission save.
   *
   * @param authority The authority identifier to associate with the field value
   *
   */
  updateAuthority(authority: string) {
    const model = this.getMandatoryFieldModel();
    const currentValue: string = (model.value instanceof FormFieldMetadataValueObject
      || model.value instanceof VocabularyEntry) ? model.value.value : model.value;
    const currentLang: string = (model.value instanceof FormFieldMetadataValueObject) ? model.value.language : model.language;
    let security = null;
    if (this.model.value instanceof VocabularyEntry) {
      security = this.model.value.securityLevel;
    } else {
      if (this.model.metadataValue) {
        security = this.model.metadataValue.securityLevel;
      }
    }
    const valueWithAuthority: any = new FormFieldMetadataValueObject(currentValue, currentLang, security, authority);
    model.value = valueWithAuthority;
    this.modifyChip();
    setTimeout(() => {
      this.submissionService.dispatchSave(this.model.submissionId);
    }, 100);
  }

  /**
   * Cleans up resources when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
    this.formBuilderService.removeFormModel(this.formId);
  }

  /**
   * Adds a new chip item to the parent collection.
   * @private
   */
  private addToChips() {
    if (!this.formRef.formGroup.valid) {
      this.formService.validateAllFormFields(this.formRef.formGroup);
      return;
    }
    if (!this.isMandatoryFieldEmpty()) {
      const item = this.buildChipItem();
      this.add.emit(item);
      this.closeModal();
    }
  }

  /**
   * Retrieves the dynamic model for the mandatory field.
   * The mandatory field is the primary field in the relation group that must
   * always have a value (e.g., author name in an author group).
   *
   * @private
   * @returns The DsDynamicInputModel for the mandatory field, or null if not found
   */
  private getMandatoryFieldModel(): DsDynamicInputModel {
    let mandatoryFieldModel = null;
    this.formModel.forEach((row) => {
      const modelRow = row as DynamicFormGroupModel;
      modelRow.group.forEach((model: DynamicInputModel) => {
        if (model.name === this.model.mandatoryField) {
          mandatoryFieldModel = model;
          this.initSecurityLevelConfig(model, modelRow);
          return;
        }
      });
    });
    return mandatoryFieldModel;
  }

  /**
   * Retrieves all fields marked as mandatory in the form configuration.
   * @private
   * @returns Array of DsDynamicInputModel instances for all mandatory fields
   */
  private getMandatoryFields(): DsDynamicInputModel[] {
    return this.formModel
      .map(row => (row as DynamicFormGroupModel).group)
      .reduce((previousValue, currentValue) => previousValue.concat(currentValue))
      .map(model => model as DsDynamicInputModel)
      .filter(model => !!model.validators && 'required' in model.validators);
  }

  /**
   * Modifies an existing chip item in the parent collection.
   * @private
   */
  private modifyChip() {
    if (!this.formRef.formGroup.valid) {
      this.formService.validateAllFormFields(this.formRef.formGroup);
      return;
    }
    if (!this.isMandatoryFieldEmpty()) {
      const item = this.buildChipItem();
      this.edit.emit(item);
      this.closeModal();
    }
  }

  /**
   * Builds a chip item object from the current form values.
   * @private
   * @returns An object containing all field values as FormFieldMetadataValueObject instances
   */
  private buildChipItem() {
    const item = Object.create({});
    let mainModel;
    this.formModel.some((modelRow: DynamicFormGroupModel) => {
      const findIndex = modelRow.group.findIndex(model => model.name === this.model.name);
      if (findIndex !== -1) {
        mainModel = modelRow.group[findIndex];
        return true;
      }
    });
    this.formModel.forEach((row) => {
      const modelRow = row as DynamicFormGroupModel;
      modelRow.group.forEach((control: DynamicInputModel) => {
        const controlValue: any = (control?.value as any)?.value || control?.value || PLACEHOLDER_PARENT_METADATA;
        const controlAuthority: any = (control?.value as any)?.authority || null;

        item[control.name] =
          new FormFieldMetadataValueObject(
            controlValue,
            mainModel?.language,
            controlValue === PLACEHOLDER_PARENT_METADATA ? null : mainModel.securityLevel,
            controlAuthority,
            null, 0, null,
            (control?.value as any)?.otherInformation || null,
          );
      });
    });
    return item;
  }

  /**
   * Initializes the security level configuration for a form control model
   * within a relation group row.
   *
   * This method handles two distinct cases based on the number of available
   * security levels in `securityConfigLevel`:
   *
   * Multiple levels (`securityConfigLevel.length > 1`):
   * - Enables the security level toggle (`toggleSecurityVisibility = true`)
   *   on the main field, and sets its `securityLevel` from the current model value.
   * - Propagates the same security level to all sibling fields in the row,
   *   but hides their toggles (`toggleSecurityVisibility = false`), since
   *   only the parent field controls the security level for the whole group.
   * - Stores the parent security level in `securityLevelParent` for reference.
   *
   * Single level (`securityConfigLevel.length === 1`):
   * - Applies to all fields in the row regardless of which field is the main one.
   * - Assigns the model's fixed security level to every field in the group
   *   and hides the toggle on all of them, since there is no choice to be made.
   *
   * @param chipModel
   * @param modelGroup
   */
  private initSecurityLevelConfig(chipModel: DynamicInputModel, modelGroup: DynamicFormGroupModel) {
    if (this.model.name === chipModel.name && this.model.securityConfigLevel.length > 1) {
      (chipModel as any).securityConfigLevel = this.model.securityConfigLevel;
      (chipModel as any).toggleSecurityVisibility = true;

      const mainRow = modelGroup.group.find(itemModel => itemModel.name === this.model.name);

      (chipModel as any).securityLevel = (mainRow as any).securityLevel || 0;
      this.securityLevelParent = (mainRow as any).securityLevel;

      modelGroup.group.forEach((item: any) => {
        if (item.name !== this.model.name) {
          item.securityConfigLevel = this.model.securityConfigLevel;
          item.toggleSecurityVisibility = false;
          item.securityLevel = this.securityLevelParent;
        }
      });
    }
    if (this.model.securityConfigLevel.length === 1) {
      modelGroup.group.forEach((item: any) => {
        item.securityConfigLevel = this.model.securityConfigLevel;
        item.toggleSecurityVisibility = false;
        item.securityLevel = this.model.securityLevel;
      });
    }
  }

  /**
   * Retrieves vocabulary configuration for autocomplete functionality.
   * This method fetches the vocabulary data from the server based on the
   * vocabulary name specified in the field configuration. The vocabulary
   * is used to provide autocomplete suggestions as the user types.
   * @private
   * @param vocabularyOptions The vocabulary options containing the vocabulary name and configuration
   */
  private retrieveVocabulary(vocabularyOptions: VocabularyOptions): void {
    this.vocabulary$ = this.vocabularyService.findVocabularyById(vocabularyOptions.name).pipe(
      getFirstSucceededRemoteDataPayload(),
      distinctUntilChanged(),
    );
  }

  changeSecurity($event) {
    if ($event.type === 'changeSecurityLevelGroup') {
      this.changedSecurity = true;
    }
  }
}
