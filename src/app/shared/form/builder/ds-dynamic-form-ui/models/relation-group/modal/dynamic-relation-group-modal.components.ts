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
 * Component representing a group input field
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

  @Input() formId: string;
  @Input() group: FormGroup;
  @Input() model: DynamicRelationGroupModel;

  @Input() item: any;
  @Input() itemIndex: number;
  @Input() changedSecurity: boolean;

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
    private activeModal: NgbActiveModal,
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
      true);
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
    if (this.item) {
      this.modifyChip();
    } else {
      this.addToChips();
    }
    this.closeModal();
  }


  canImport() {
    return !this.isMandatoryFieldEmpty() && this.item && !this.hasMandatoryFieldAuthority();
  }

  closeModal() {
    this.activeModal.close();
  }


  /**
   * Update the model authority value.
   * @param authority
   */
  updateAuthority(authority: string) {
    const model = this.getMandatoryFieldModel();
    const currentValue: string = (model.value instanceof FormFieldMetadataValueObject
      || model.value instanceof VocabularyEntry) ? model.value.value : model.value;
    const currentLang: string = (model.value instanceof FormFieldMetadataValueObject) ? model.value.language : model.language;
    const security = null;
    const valueWithAuthority: any = new FormFieldMetadataValueObject(currentValue, currentLang, security, authority);
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

  private retrieveVocabulary(vocabularyOptions: VocabularyOptions): void {
    this.vocabulary$ = this.vocabularyService.findVocabularyById(vocabularyOptions.name).pipe(
      getFirstSucceededRemoteDataPayload(),
      distinctUntilChanged(),
    );
  }
}
