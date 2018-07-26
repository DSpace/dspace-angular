import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { DynamicFormControlModel, DynamicFormGroupModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { isEqual } from 'lodash';

import { DynamicGroupModel, PLACEHOLDER_PARENT_METADATA } from './dynamic-group.model';
import { FormBuilderService } from '../../../form-builder.service';
import { SubmissionFormsModel } from '../../../../../../core/shared/config/config-submission-forms.model';
import { FormService } from '../../../../form.service';
import { FormComponent } from '../../../../form.component';
import { Chips } from '../../../../../chips/models/chips.model';
import { hasValue, isEmpty, isNotEmpty } from '../../../../../empty.util';
import { shrinkInOut } from '../../../../../animations/shrink';
import { ChipsItem } from '../../../../../chips/models/chips-item.model';
import { GlobalConfig } from '../../../../../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../../../../../config';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { hasOnlyEmptyProperties } from '../../../../../object.util';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { AuthorityValueModel } from '../../../../../../core/integration/models/authority-value.model';

@Component({
  selector: 'ds-dynamic-group',
  styleUrls: ['./dynamic-group.component.scss'],
  templateUrl: './dynamic-group.component.html',
  animations: [shrinkInOut]
})
export class DsDynamicGroupComponent implements OnDestroy, OnInit {

  @Input() formId: string;
  @Input() group: FormGroup;
  @Input() model: DynamicGroupModel;
  @Input() showErrorMessages = false;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public chips: Chips;
  public formCollapsed = Observable.of(false);
  public formModel: DynamicFormControlModel[];
  public editMode = false;

  private selectedChipItem: ChipsItem;
  private subs: Subscription[] = [];

  @ViewChild('formRef') private formRef: FormComponent;

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              private formBuilderService: FormBuilderService,
              private formService: FormService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    const config = {rows: this.model.formConfiguration} as SubmissionFormsModel;
    if (!this.model.isEmpty()) {
      this.formCollapsed = Observable.of(true);
    }
    this.model.valueUpdates.subscribe((value: any[]) => {
      if ((isNotEmpty(value) && !(value.length === 1 && hasOnlyEmptyProperties(value[0])))) {
        this.collapseForm();
      } else {
        this.expandForm();
      }
      // this.formCollapsed = (isNotEmpty(value) && !(value.length === 1 && hasOnlyEmptyProperties(value[0]))) ? Observable.of(true) : Observable.of(false);
    });

    this.formId = this.formService.getUniqueId(this.model.id);
    this.formModel = this.formBuilderService.modelFromConfiguration(
      config,
      this.model.scopeUUID,
      {},
      this.model.submissionScope,
      this.model.readOnly);
    const initChipsValue = this.model.isEmpty() ? [] : this.model.value;
    this.chips = new Chips(
      initChipsValue,
      'value',
      this.model.mandatoryField,
      this.EnvConfig.submission.metadata.icons);
    this.subs.push(
      this.chips.chipsItems
        .subscribe((subItems: any[]) => {
          const items = this.chips.getChipsItems();
          // Does not emit change if model value is equal to the current value
          if (!isEqual(items, this.model.value)) {
            // if ((isNotEmpty(items) && !this.model.isEmpty()) || (isEmpty(items) && !this.model.isEmpty())) {
            if (!(isEmpty(items) && this.model.isEmpty())) {
              this.model.valueUpdates.next(items);
              this.change.emit();
            }
          }
        }),
    )
  }

  isMandatoryFieldEmpty() {
    // formModel[0].group[0].value == null
    let res = true;
    this.formModel.forEach((row) => {
      const modelRow = row as DynamicFormGroupModel;
      modelRow.group.forEach((model: DynamicInputModel) => {
        if (model.name === this.model.mandatoryField) {
          res = model.value == null;
          return;
        }
      });
    });
    return res;
  }

  onBlur(event) {
    this.blur.emit();
  }

  onChipSelected(event) {
    this.expandForm();
    this.selectedChipItem = this.chips.getChipByIndex(event);
    this.formModel.forEach((row) => {
      const modelRow = row as DynamicFormGroupModel;
      modelRow.group.forEach((model: DynamicInputModel) => {
        const value = (this.selectedChipItem.item[model.name] === PLACEHOLDER_PARENT_METADATA
          || this.selectedChipItem.item[model.name].value === PLACEHOLDER_PARENT_METADATA)
          ? null
          : this.selectedChipItem.item[model.name];
        // if (value instanceof FormFieldMetadataValueObject || value instanceof AuthorityValueModel) {
        //   model.valueUpdates.next(value.display);
        // } else {
        //   model.valueUpdates.next(value);
        // }
        model.valueUpdates.next(value);
      });
    });

    this.editMode = true;
  }

  onFocus(event) {
    this.focus.emit(event);
  }

  collapseForm() {
    this.formCollapsed = Observable.of(true);
    this.clear();
  }

  expandForm() {
    this.formCollapsed = Observable.of(false);
  }

  clear() {
    if (this.editMode) {
      this.selectedChipItem.editMode = false;
      this.selectedChipItem = null;
      this.editMode = false;
    }
    this.resetForm();
    if (!this.model.isEmpty()) {
      this.formCollapsed = Observable.of(true);
    }
  }

  save() {
    if (this.editMode) {
      this.modifyChip();
    } else {
      this.addToChips();
    }
  }

  delete() {
    this.chips.remove(this.selectedChipItem);
    this.clear();
  }

  private addToChips() {
    if (!this.formRef.formGroup.valid) {
      this.formService.validateAllFormFields(this.formRef.formGroup);
      return;
    }

    // Item to add
    if (!this.isMandatoryFieldEmpty()) {
      const item = this.buildChipItem();
      this.chips.add(item);

      this.resetForm();
    }
  }

  private modifyChip() {
    if (!this.formRef.formGroup.valid) {
      this.formService.validateAllFormFields(this.formRef.formGroup);
      return;
    }

    if (!this.isMandatoryFieldEmpty()) {
      const item = this.buildChipItem();
      this.chips.update(this.selectedChipItem.id, item);
      this.resetForm();
      this.cdr.detectChanges();
    }
  }

  private buildChipItem() {
    const item = Object.create({});
    this.formModel.forEach((row) => {
      const modelRow = row as DynamicFormGroupModel;
      modelRow.group.forEach((control: DynamicInputModel) => {
        item[control.name] = control.value || PLACEHOLDER_PARENT_METADATA;
      });
    });
    return item;
  }

  private resetForm() {
    if (this.formRef) {
      this.formService.resetForm(this.formRef.formGroup, this.formModel, this.formId);
    }
  }

  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

}
