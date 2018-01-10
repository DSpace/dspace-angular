import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DynamicGroupModel } from './dynamic-group.model';
import { FormGroup } from '@angular/forms';
import { FormBuilderService } from '../../../form-builder.service';
import { DynamicFormControlModel, DynamicFormGroupModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { SubmissionFormsModel } from '../../../../../../core/shared/config/config-submission-forms.model';
import { AuthorityModel } from '../../../../../../core/integration/models/authority.model';
import { FormService } from '../../../../form.service';
import { Chips } from '../../../../../chips/chips.model';
import { FormComponent } from '../../../../form.component';

const PLACEHOLDER = '#PLACEHOLDER_PARENT_METADATA_VALUE#';

@Component({
  selector: 'ds-dynamic-group',
  templateUrl: './dynamic-group.component.html',
})
export class DsDynamicGroupComponent implements OnInit {

  public formModel: DynamicFormControlModel[];
  // public formModelRow: DynamicFormGroupModel;
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
    console.log('FormConfiguration...');
    console.log(this.model.formConfiguration);
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
    })

    console.log(item);

    // If no mandatory field value, abort
    if (!item[this.model.mandatoryField] || item[this.model.mandatoryField] === PLACEHOLDER) {
      return false;
    }

    // Search for duplicates
    let exit = false;
    this.model.chips.chipsItems.forEach((current) => {
      if (current.item && current.item[this.model.mandatoryField] && current.item[this.model.mandatoryField]) {
        const internalItem = current.item[this.model.mandatoryField];
        if (internalItem instanceof AuthorityModel) {
          // With Authority
          if (internalItem.id === item[this.model.mandatoryField].id) {
          // Duplicate Item, don't add
            exit = true;
            return;
          }
        } else if (internalItem === item[this.model.mandatoryField]) {
          // Without Authority
          exit = true;
          return;
        }
      }
    })

    if (exit) {
      return;
    }

    this.model.chips.add(item);
    this.model.valueUpdates.next(this.model.chips.getItems());
    this.change.emit(event);

    this.formRef.formGroup.reset();
    /*setTimeout(() => {
      // Reset the input text after x ms, mandatory or the formatter overwrite it
      const keys = Object.keys(this.group.controls); // df-row-group-config-18
      // (this.group.controls[keys[0]] as FormGroup).controls[AUTHOR_KEY].patchValue(null);
      this.formRef.formGroup.reset();
    }, 50);
*/
    console.log(this.model.chips.getItems());
  }

  chipsSelected(event) {
    console.log('Selected chips : ' + JSON.stringify(this.model.chips.chipsItems[event]));
    console.log(event);

    const selected = this.model.chips.chipsItems[event].item;
    const keys = Object.keys(this.group.controls);

    this.formModel.forEach((row, i) => {
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
    const keys = Object.keys(this.group.controls);
    console.log(keys);

    // Set ChipsItem's editModel=false
    const item = {};
    this.formModel.forEach((row) => {
      const modelRow = row as DynamicFormGroupModel;
      modelRow.group.forEach((control: DynamicInputModel) => {
        item[control.name] = control.value || PLACEHOLDER;
      })
    });
    this.model.chips.chipsItems.forEach((current) => {
      if (current.item && current.item[this.model.mandatoryField] && current.item[this.model.mandatoryField] === item[this.model.mandatoryField]) {
        current.editMode = false;
      }
    });

    this.editMode = false;
    this.group.reset();
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

  removeChips(event) {
    this.model.valueUpdates.next(this.model.chips.getItems());
    this.change.emit(event);
  }

  onBlur(event) {
    this.blur.emit(event);
  }

  onChange(event) {
    // AuthorityModel
    // display: "Salz, Dirk"
    // id: "no2015021623"
    // value: "Salz, Dirk"
    console.log(event);
    console.log(event.$event);
    this.change.emit(event);
  }

  onFocus(event) {
    this.focus.emit(event);
  }

}
