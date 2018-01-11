import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DynamicGroupModel } from './dynamic-group.model';
import { FormGroup } from '@angular/forms';
import { FormBuilderService } from '../../../form-builder.service';
import { DynamicFormControlModel, DynamicFormGroupModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { SubmissionFormsModel } from '../../../../../../core/shared/config/config-submission-forms.model';
import { FormService } from '../../../../form.service';
import { FormComponent } from '../../../../form.component';

const PLACEHOLDER = '#PLACEHOLDER_PARENT_METADATA_VALUE#';

@Component({
  selector: 'ds-dynamic-group',
  templateUrl: './dynamic-group.component.html',
})
export class DsDynamicGroupComponent implements OnInit {

  public formModel: DynamicFormControlModel[];
  public editMode = false;

  @Input() formId: string;
  @Input() model: DynamicGroupModel;
  @Input() group: FormGroup;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('formRef') private formRef: FormComponent;

  constructor(private formBuilderService: FormBuilderService, private formService: FormService) {

  }

  ngOnInit() {
    const config = {rows: this.model.formConfiguration} as SubmissionFormsModel;
    this.formId = this.formService.getUniqueId(this.model.id);
    this.formModel = this.formBuilderService.modelFromConfiguration(config, {});
  }

  addChips(event) {
    // if(!this.group.valid) {
    //   this.formService.validateAllFormFields(this.group);
    //   return;
    // }

    // Item to add
    const item = {};
    this.formModel.forEach((row) => {
      const modelRow = row as DynamicFormGroupModel;
      modelRow.group.forEach((control: DynamicInputModel) => {
        item[control.name] = control.value || PLACEHOLDER;
      });
    });

    this.model.chips.add(item);
    this.model.valueUpdates.next(this.model.chips.getItems());
    this.change.emit(event);
    this.resetForm();
  }

  chipsSelected(event) {
    const selected = this.model.chips.chipsItems[event].item;
    this.formModel.forEach((row) => {
      const modelRow = row as DynamicFormGroupModel;
      modelRow.group.forEach((model: DynamicInputModel) => {
        const value = selected[model.name] === PLACEHOLDER ? null : selected[model.name];
        if (model instanceof DynamicInputModel) {
          model.valueUpdates.next(value);
        } else {
          (model as any).value = value;
        }
      });
    });

    this.editMode = true;
  }

  exitEditMode() {
    this.editMode = false;
    this.resetForm();
  }

  modifyChips() {
    const item = {};
    this.formModel.forEach((row) => {
      const modelRow = row as DynamicFormGroupModel;
      modelRow.group.forEach((control: DynamicInputModel) => {
        item[control.name] = control.value || PLACEHOLDER;
      })
    });

    this.model.chips.chipsItems.forEach((current) => {
      if (current.item && current.item[this.model.mandatoryField] && current.item[this.model.mandatoryField] === item[this.model.mandatoryField]) {
        current.item = Object.assign({}, item);
        current.editMode = false;
        this.change.emit(event);
        this.editMode = false;
        this.group.reset();
      }
    });
  }

  resetForm() {
    this.formService.resetForm(this.formRef.formGroup, this.formModel, this.formId);
  }

  removeChips(event) {
    this.model.valueUpdates.next(this.model.chips.getItems());
    this.change.emit(event);
  }

  onBlur(event) {
    this.blur.emit(event);
  }

  onChange(event) {
    this.change.emit(event);
  }

  onFocus(event) {
    this.focus.emit(event);
  }

}
