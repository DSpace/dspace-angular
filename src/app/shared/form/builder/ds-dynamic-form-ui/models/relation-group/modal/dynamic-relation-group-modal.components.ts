import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, of as observableOf, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';
import {
  DynamicFormControlComponent,
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicInputModel
} from '@ng-dynamic-forms/core';
import { shrinkInOut } from '../../../../../../animations/shrink';
import { DynamicRelationGroupModel } from '../dynamic-relation-group.model';
import { Vocabulary } from '../../../../../../../core/submission/vocabularies/models/vocabulary.model';
import { FormComponent } from '../../../../../form.component';
import { VocabularyService } from '../../../../../../../core/submission/vocabularies/vocabulary.service';
import { FormBuilderService } from '../../../../form-builder.service';
import { FormService } from '../../../../../form.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubmissionService } from '../../../../../../../submission/submission.service';
import { SubmissionFormsModel } from '../../../../../../../core/config/models/config-submission-forms.model';
import { hasValue, isNotEmpty, isNotNull } from '../../../../../../empty.util';
import { PLACEHOLDER_PARENT_METADATA } from '../../../ds-dynamic-form-constants';
import { SubmissionScopeType } from '../../../../../../../core/submission/submission-scope-type';
import {
  VocabularyExternalSourceComponent
} from '../../../../../../vocabulary-external-source/vocabulary-external-source.component';
import { FormFieldMetadataValueObject } from '../../../../models/form-field-metadata-value.model';
import { VocabularyEntry } from '../../../../../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { DsDynamicInputModel } from '../../ds-dynamic-input.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../../core/shared/operators';
import { VocabularyOptions } from '../../../../../../../core/submission/vocabularies/models/vocabulary-options.model';
import {
  MetadataSecurityConfiguration
} from '../../../../../../../core/submission/models/metadata-security-configuration';

/**
 * Component representing a group input field
 */
@Component({
  selector: 'ds-dynamic-relation-group-modal',
  styleUrls: ['../dynamic-relation-group.component.scss'],
  templateUrl: './dynamic-relation-group-modal.component.html',
  animations: [shrinkInOut]
})
export class DsDynamicRelationGroupModalComponent extends DynamicFormControlComponent implements OnDestroy, OnInit {

  @Input() formId: string;
  @Input() group: FormGroup;
  @Input() model: DynamicRelationGroupModel;

  @Input() item: any;
  @Input() itemIndex: number;
  @Input() changedSecurity: boolean;
  @Input() metadataSecurityConfiguration: MetadataSecurityConfiguration;

  @Input() value: any;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  @Output() edit: EventEmitter<any> = new EventEmitter<any>();
  @Output() add: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('formRef', { static: false }) private formRef: FormComponent;

  public formModel: DynamicFormControlModel[];
  public vocabulary$: Observable<Vocabulary>;
  public securityLevelParent: number;

  private subs: Subscription[] = [];


  constructor(private vocabularyService: VocabularyService,
    private formBuilderService: FormBuilderService,
    private formService: FormService,
    private cdr: ChangeDetectorRef,
    protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService,
    protected modalService: NgbModal,
    protected submissionService: SubmissionService,
    private activeModal: NgbActiveModal
  ) {
    super(layoutService, validationService);
  }

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
        modelRow.group.forEach((model: DynamicInputModel) => {
          const value = (this.item[model.name] === PLACEHOLDER_PARENT_METADATA
            || this.item[model.name].value === PLACEHOLDER_PARENT_METADATA)
            ? null
            : this.item[model.name];
          const nextValue = (this.formBuilderService.isInputModel(model) && isNotNull(value) && (typeof value !== 'string')) ?
            value.value : value;
          if (isNotEmpty(nextValue)) {
            model.value = nextValue;
          }

          this.initSecurityLevelConfig(model, modelRow);
        });
      });
    }
    const mandatoryFieldModel = this.getMandatoryFieldModel(); // @Input
    if (mandatoryFieldModel.vocabularyOptions && isNotEmpty(mandatoryFieldModel.vocabularyOptions.name)) {
      this.retrieveVocabulary(mandatoryFieldModel.vocabularyOptions);
    }

  }

  getHeader() {
    return this.getMandatoryFieldModel().label;
  }

  isMandatoryFieldEmpty() {
    const models = this.getMandatoryFields();
    return models.some(model => !model.value);
  }

  hasMandatoryFieldAuthority() {
    const model = this.getMandatoryFieldModel();
    return hasValue(model.value)
      && typeof model.value === 'object'
      && (model.value as any).hasAuthority();
  }

  onBlur(event) {
    this.blur.emit();
  }

  onFocus(event) {
    this.focus.emit(event);
  }

  save() {
    this.canShowExternalSourceButton().pipe(
      take(1)
    ).subscribe((hanExternalSource: boolean) => {
      if (this.item) {
        this.modifyChip();
      } else {
        this.addToChips();
      }
      if (hanExternalSource) {
        this.submissionService.dispatchSave(this.model.submissionId);
      }
      this.closeModal();
    });

  }

  canShowExternalSourceButton(): Observable<boolean> {
    const model = this.getMandatoryFieldModel();
    if ((this.model as any).submissionScope === SubmissionScopeType.WorkflowItem && model.vocabularyOptions && isNotEmpty(model.vocabularyOptions.name)) {
      return this.vocabulary$.pipe(
        filter((vocabulary: Vocabulary) => isNotEmpty(vocabulary)),
        map((vocabulary: Vocabulary) => isNotEmpty(vocabulary.entity) && isNotEmpty(vocabulary.getExternalSourceByMetadata(this.model.mandatoryField)))
      );
    } else {
      return observableOf(false);
    }
  }

  canImport() {
    return !this.isMandatoryFieldEmpty() && this.item && !this.hasMandatoryFieldAuthority();
  }

  closeModal() {
    this.activeModal.close();
  }

  /**
   * Start the creation of an entity by opening up a collection choice modal window.
   */
  public createEntityFromMetadata(): void {
    this.vocabulary$.pipe(
      filter((vocabulary: Vocabulary) => isNotEmpty(vocabulary)),
      take(1)
    ).subscribe((vocabulary: Vocabulary) => {
      const modalRef = this.modalService.open(VocabularyExternalSourceComponent, {
        size: 'lg',
      });
      modalRef.componentInstance.entityType = vocabulary.entity;
      modalRef.componentInstance.externalSourceIdentifier = vocabulary.getExternalSourceByMetadata(this.model.mandatoryField);
      modalRef.componentInstance.submissionObjectID = this.model.submissionId;
      modalRef.componentInstance.metadataPlace = this.itemIndex?.toString(10) || '0';

      modalRef.componentInstance.updateAuthority.pipe(take(1)).subscribe((authority) => {
        setTimeout(() => {
          this.updateAuthority(authority);
        }, 100);
      });
    });
  }

  /**
   * Update the model authority value.
   * @param authority
   */
  updateAuthority(authority: string) {
    const model = this.getMandatoryFieldModel();
    const currentValue: string = (model.value instanceof FormFieldMetadataValueObject
      || model.value instanceof VocabularyEntry) ? model.value.value : model.value;
    let security = null;
    if (this.model.value instanceof VocabularyEntry) {
      security = this.model.value.securityLevel;
    } else {
      if (this.model.metadataValue) {
        security = this.model.metadataValue.securityLevel;
      }
    }
    const valueWithAuthority: any = new FormFieldMetadataValueObject(currentValue, null, security, authority);
    model.value = valueWithAuthority;
    this.modifyChip();
    setTimeout(() => {
      this.submissionService.dispatchSave(this.model.submissionId);
    }, 100);
  }

  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
    this.formBuilderService.removeFormModel(this.formId);
  }

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

  private getMandatoryFields(): DsDynamicInputModel[] {
    return this.formModel
      .map(row => (row as DynamicFormGroupModel).group)
      .reduce((previousValue, currentValue) => previousValue.concat(currentValue))
      .map(model => model as DsDynamicInputModel)
      .filter(model => !!model.validators && 'required' in model.validators);
  }

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
            controlValue, (control as any)?.language,
            controlValue === PLACEHOLDER_PARENT_METADATA ? null : mainModel.securityLevel,
            controlAuthority,
            null, 0, null,
            (control?.value as any)?.otherInformation || null
          );
      });
    });
    return item;
  }

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
