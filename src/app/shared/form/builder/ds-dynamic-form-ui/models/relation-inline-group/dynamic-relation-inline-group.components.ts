import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormArray,
  FormGroup,
} from '@angular/forms';
import { SubmissionFormsModel } from '@dspace/core/config/models/config-submission-forms.model';
import { PLACEHOLDER_PARENT_METADATA } from '@dspace/core/shared/form/ds-dynamic-form-constants';
import { FormFieldMetadataValueObject } from '@dspace/core/shared/form/models/form-field-metadata-value.model';
import { MetadataSecurityConfiguration } from '@dspace/core/submission/models/metadata-security-configuration';
import {
  isEmpty,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import {
  DynamicFormArrayGroupModel,
  DynamicFormControlComponent,
  DynamicFormControlEvent,
  DynamicFormControlLayout,
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

import { SubmissionService } from '../../../../../../submission/submission.service';
import { shrinkInOut } from '../../../../../animations/shrink';
import { FormComponent } from '../../../../form.component';
import { FormService } from '../../../../form.service';
import { FormBuilderService } from '../../../form-builder.service';
import { setLayout } from '../../../parsers/parser.utils';
import {
  DynamicRowArrayModel,
  DynamicRowArrayModelConfig,
} from '../ds-dynamic-row-array-model';
import { DynamicRelationGroupModel } from '../relation-group/dynamic-relation-group.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ds-dynamic-relation-inline-group',
  styleUrls: ['./dynamic-relation-inline-group.component.scss'],
  templateUrl: './dynamic-relation-inline-group.component.html',
  animations: [shrinkInOut],
  imports: [
    FormComponent,
    NgClass,
  ],
})
export class DsDynamicRelationInlineGroupComponent extends DynamicFormControlComponent implements OnInit, OnDestroy {

  @Input() formId: string;
  @Input() group: FormGroup;
  @Input() model: DynamicRelationGroupModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public formCollapsed = of(false);
  public formGroup: FormGroup;
  public formModel: DynamicFormControlModel[];

  @ViewChild('formRef', { static: false }) private formRef: FormComponent;
  protected metadataSecurityConfiguration: MetadataSecurityConfiguration;

  constructor(private formBuilderService: FormBuilderService,
    private formService: FormService,
    protected layoutService: DynamicFormLayoutService,
    protected submissionService: SubmissionService,
    protected validationService: DynamicFormValidationService,
  ) {
    super(layoutService, validationService);
  }

  ngOnInit() {
    this.submissionService.getSubmissionSecurityConfiguration(this.model.submissionId).pipe(
      take(1)).subscribe(security => {
      this.metadataSecurityConfiguration = security;
    });
    const config = { rows: this.model.formConfiguration } as SubmissionFormsModel;

    this.formId = this.formService.getUniqueId(this.model.id);
    this.formModel = this.initArrayModel(config);
    this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
    this.formBuilderService.addFormModel(this.formId, this.formModel);
  }

  initArrayModel(formConfig): DynamicRowArrayModel[] {
    let arrayCounter = 0;
    const config = {
      id: this.model.id + '_array',
      initialCount: isNotEmpty(this.model.value) ? (this.model.value as any[]).length : 1,
      isDraggable: true,
      isInlineGroupArray: true,
      groupFactory: () => {
        const fieldValue = isEmpty(this.model.value) || (arrayCounter === 0) ? {} : this.model.value[arrayCounter - 1];
        const model: any = this.initArrayItemModel(formConfig, this.normalizeGroupFormValue(fieldValue));
        arrayCounter++;
        setLayout(model, 'element', 'host', 'col');
        if (model.hasLanguages) {
          setLayout(model, 'grid', 'control', 'col');
        }
        return [model];
      },
    } as DynamicRowArrayModelConfig;

    const layout: DynamicFormControlLayout = {
      grid: {
        group: 'row',
      },
    };

    return [new DynamicRowArrayModel(config, layout)];
  }

  initArrayItemModel(formConfig, initValues: any = {}) {
    const formModel = this.formBuilderService.modelFromConfiguration(
      this.model.submissionId,
      formConfig,
      this.model.scopeUUID,
      initValues,
      this.model.submissionScope,
      this.model.readOnly,
      this.formBuilderService.getTypeBindModel(),
      true,
      this.metadataSecurityConfiguration)[0];

    (formModel as any).group?.forEach((modelItem: DynamicInputModel) => {
      this.initSecurityLevelConfig(modelItem, (formModel as any));
    });
    return formModel;
  }

  onBlur(event: DynamicFormControlEvent) {
    this.blur.emit();
  }

  onChange(event: DynamicFormControlEvent) {
    const index = event.model.parent.parent.index;
    let parentSecurityLevel;
    if (event.type === 'change') {
      parentSecurityLevel = this.model.securityLevel;
    }
    const groupValue = this.getRowValue(event.model.parent as DynamicFormGroupModel, parentSecurityLevel);

    if (this.hasEmptyGroupValue(groupValue)) {
      this.removeItemFromArray(event);
      this.removeItemFromModelValue(index);
    } else if (isEmpty(groupValue[this.model.mandatoryField])) {
      this.formService.validateAllFormFields(event.group);
    } else {
      this.updateArrayModelValue(groupValue, index);
    }
    this.change.emit();
  }

  hasEmptyGroupValue(groupValue): boolean {
    const keysNotEmpty = Object.keys(groupValue)
      .filter((metadata) => isNotEmpty(groupValue[metadata]) && groupValue[metadata] !== PLACEHOLDER_PARENT_METADATA);
    return isEmpty(keysNotEmpty);
  }

  onFocus(event: DynamicFormControlEvent) {
    this.focus.emit();
  }

  remove(event: DynamicFormControlEvent) {
    const index = event.model.parent.index;
    const size = (event.model.parent.parent as any).size;
    if (isNotEmpty(this.model.value) && size === (this.model.value as any[]).length) {
      this.removeItemFromModelValue(index);
    }
  }

  private findModelGroups() {
    this.formModel.forEach((row: any) => {
      row.groups.forEach((groupArray) => {
        groupArray.group.forEach((groupRow) => {
          const modelRow = groupRow as DynamicFormGroupModel;
          modelRow.group.forEach((model: DynamicInputModel) => {
            this.initSecurityLevelConfig(model, modelRow);
          });
        });
      });
    });
  }

  /**
   * Initializes the security level configuration for a field model
   * within an inline relation group row.
   *
   * Multiple levels (`securityConfigLevel.length > 1`):
   * - Enables the security toggle (`toggleSecurityVisibility = true`) on the
   *   primary field and resolves its security level with the following priority:
   *   1. `this.model.securityLevel` if it is not empty.
   *   2. The existing `securityLevel` read directly from the matched row model.
   * - Propagates the resolved security level to all sibling fields in the row,
   *   hiding their toggles (`toggleSecurityVisibility = false`) since only the
   *   primary field drives the level for the entire group.
   *
   * Single level (`securityConfigLevel.length === 1`):
   * - Applies to every field in the row regardless of which field is primary.
   * - Locks all fields to `this.model.securityLevel` and hides all toggles,
   *   since there is no user choice to be made.
   *
   * @param model - The dynamic input model of the field being initialized.
   * @param modelGroup - The parent form group row containing `model` and its siblings.
   */
  private initSecurityLevelConfig(model: any, modelGroup: DynamicFormGroupModel) {
    if (this.model.name === model.name && this.model.securityConfigLevel?.length > 1) {
      model.securityConfigLevel = this.model.securityConfigLevel;
      model.toggleSecurityVisibility = true;

      let mainSecurityLevel;
      const mainRow = modelGroup.group.find(itemModel => itemModel.name === this.model.name);
      if (isNotEmpty(this.model.securityLevel)) {
        mainSecurityLevel = this.model.securityLevel;
      } else {
        mainSecurityLevel = (mainRow as any).securityLevel;
      }

      model.securityLevel = mainSecurityLevel;
      model.language = (mainRow as any).language ?? null;

      modelGroup.group.forEach((item: any) => {
        if (item.name !== this.model.name) {
          item.securityConfigLevel = this.model.securityConfigLevel;
          item.toggleSecurityVisibility = false;
          item.securityLevel = mainSecurityLevel;
        }
      });
    }
    if (this.model.securityConfigLevel?.length === 1) {
      modelGroup.group.forEach((item: any) => {
        item.securityConfigLevel = this.model.securityConfigLevel;
        item.toggleSecurityVisibility = false;
        item.securityLevel = this.model.securityLevel;
      });
    }
  }

  private getRowValue(formGroup: DynamicFormGroupModel, securityLevel?: number) {
    let mainSecurityLevel;
    const mainRow = formGroup.group.find(itemModel => itemModel.name === this.model.name);
    if (isNotEmpty(securityLevel)) {
      mainSecurityLevel = securityLevel;
    } else {
      mainSecurityLevel = (mainRow as any).securityLevel;
    }
    const mainLanguage = (mainRow as any).language ?? null;
    const groupValue = Object.create({});
    formGroup.group.forEach((model: any) => {
      if (model.name !== this.model.mandatoryField) {
        if (isEmpty(model.value)) {
          groupValue[model.name] = PLACEHOLDER_PARENT_METADATA;
        } else {
          if (typeof model.value === 'string') {
            groupValue[model.name] = new FormFieldMetadataValueObject(model.value, mainLanguage, mainSecurityLevel);
          } else {
            groupValue[model.name] = Object.assign(new FormFieldMetadataValueObject(), model.value, { language: mainLanguage, securityLevel: mainSecurityLevel || null });
          }
        }
      } else {
        if (typeof model.value === 'string') {
          groupValue[model.name] = new FormFieldMetadataValueObject(model.value, mainLanguage, mainSecurityLevel);
        } else {
          groupValue[model.name] = Object.assign(new FormFieldMetadataValueObject(), model.value, { language: mainLanguage, securityLevel: mainSecurityLevel || null });
        }
      }
    });
    return groupValue;
  }

  private normalizeGroupFormValue(valueObj) {
    const normValue = Object.create({});
    if (isNotEmpty(valueObj)) {
      Object.keys(valueObj).forEach((metadata) => {
        if (!this.hasPlaceholder(valueObj[metadata])) {
          normValue[metadata] = [valueObj[metadata]];
        }
      });
    }

    return normValue;
  }

  private hasPlaceholder(value: string | FormFieldMetadataValueObject): boolean {
    return (value instanceof FormFieldMetadataValueObject) ? value.hasPlaceholder() : (isNotEmpty(value) && value === PLACEHOLDER_PARENT_METADATA);
  }

  private removeItemFromModelValue(removeIndex) {
    const newValue = (this.model.value as any[]).filter((value, itemIndex) => itemIndex !== removeIndex);
    this.model.value = newValue;
    this.change.emit();
  }

  private removeItemFromArray(event: DynamicFormControlEvent): void {
    const parentArrayModel: DynamicFormArrayGroupModel = event.model.parent.parent as DynamicFormArrayGroupModel;
    const arraySize = parentArrayModel.parent.size;
    if (arraySize > 1) {
      const index = parentArrayModel.index;
      const arrayContext = parentArrayModel.context;
      const path = this.formBuilderService.getPath(arrayContext);
      const formArrayControl = this.formGroup.get(path) as FormArray;
      this.formBuilderService.removeFormArrayGroup(index, formArrayControl, arrayContext);
      this.formService.changeForm(this.formId, this.formModel);
    }
  }

  private updateArrayModelValue(groupValue, index) {
    let modelValue = this.model.value;
    if (isEmpty(modelValue)) {
      modelValue = [groupValue];
    } else {
      modelValue[index] = groupValue;
    }
    this.model.value = modelValue;
  }

  onCustomEvent(event) {
    if (event.type === 'move') {
      this.moveArrayItem(event);
    } else if (event.type === 'copy') {
      this.copyArrayItem(event);
    }
  }

  ngOnDestroy(): void {
    this.formBuilderService.removeFormModel(this.formId);
  }

  private moveArrayItem(event) {
    const index = event.$event.index;
    const previousIndex = event.$event.previousIndex;
    let arrayOfValue: any = this.model.value;

    if (arrayOfValue[index] === undefined || arrayOfValue[previousIndex] === undefined) {
      return;
    } else if (arrayOfValue.length > 0) {
      arrayOfValue = arrayOfValue.filter((el) => el !== undefined);
    } else {
      return;
    }

    const temp = this.model.value[index];
    this.model.value[index] = this.model.value[previousIndex];
    this.model.value[previousIndex] = temp;

    this.change.emit();
  }

  private copyArrayItem(event) {
    const index = Array.isArray(this.model.value) ? this.model.value.length : event.model.parent.index;
    const groupValue = this.getRowValue(event.model as DynamicFormGroupModel);
    this.updateArrayModelValue(groupValue, index);
    this.change.emit();
  }
}
