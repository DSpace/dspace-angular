import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DynamicGroupModel } from './dynamic-group.model';
import { FormGroup } from '@angular/forms';
import { FormBuilderService } from '../../../form-builder.service';
import { DynamicFormControlModel, DynamicFormGroupModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { SubmissionFormsModel } from '../../../../../../core/shared/config/config-submission-forms.model';
import { AuthorityModel } from '../../../../../../core/integration/models/authority.model';
import { FormService } from "../../../../form.service";

const PLACEHOLDER = '#PLACEHOLDER_PARENT_METADATA_VALUE#';

@Component({
  selector: 'ds-dynamic-group',
  templateUrl: './dynamic-group.component.html',
})
export class DsDynamicGroupComponent implements OnInit {

  public formModel: DynamicFormControlModel[];
  public formModelRow: DynamicFormGroupModel;
  public editMode = false;

  @Input() formId: string;
  @Input() model: DynamicGroupModel;
  @Input() group: FormGroup;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  // author: DynamicTypeaheadModel;
  // orcId: DynamicInputModel;
  // affiliation: DynamicInputModel;

  constructor(private formBuilderService: FormBuilderService, private formService: FormService) {
  }

  ngOnInit() {
    console.log('FormConfiguration...');
    console.log(this.model.formConfiguration);
    const config = {rows: this.model.formConfiguration} as SubmissionFormsModel;
    this.formModel = this.formBuilderService.modelFromConfiguration(config, {});
    this.formModelRow = this.formModel[0] as DynamicGroupModel;

    this.model.storedValue = [];
    if (this.model.storedValue && this.model.storedValue.length > 0) {
      // Values found in edit
      this.model.storedValue.forEach((v) => {
        let item;
        // if (withAuthority) {
        // item = {
        //   id: v.authority || v.value,
        //   value: v.value,
        //   display: v.value
        // } as AuthorityModel;
        // }
        // else {
        //   item = v.value;
        // }
        this.model.chips.add(item);
      });
    }
  }

  addChips(event) {
    // if(!this.group.valid) {
    //   this.formService.validateAllFormFields(this.group);
    //   return;
    // }

    // Item to add
    const item = {};
    this.formModelRow.group.forEach((control: DynamicInputModel) => {
      item[control.name] = control.value || PLACEHOLDER;
    });
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
          if (internalItem.id === item[this.model.mandatoryField].id)
          // Duplicate Item, don't add
            exit = true;
          return;
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
    this.change.emit(event);

    setTimeout(() => {
      // Reset the input text after x ms, mandatory or the formatter overwrite it
      const keys = Object.keys(this.group.controls); // df-row-group-config-18
      // (this.group.controls[keys[0]] as FormGroup).controls[AUTHOR_KEY].patchValue(null);
      this.group.reset();
    }, 50);

    console.log(this.model.chips.getItems());
  }

  chipsSelected(event) {
    console.log('Selected chips : ' + JSON.stringify(this.model.chips.chipsItems[event]));
    console.log(event);


    const selected = this.model.chips.chipsItems[event].item;
    const keys = Object.keys(this.group.controls);

    this.formModelRow.group.forEach((control: DynamicInputModel) => {
      (this.group.controls[keys[0]] as FormGroup).controls[control.id].patchValue(selected[control.name]);
    });

    this.editMode = true;
  }

  exitEditMode() {
    const keys = Object.keys(this.group.controls);
    console.log(keys);

    this.editMode = false;
    this.group.reset();
  }

  modifyChips() {
    const item = {};
    this.formModelRow.group.forEach((control: DynamicInputModel) => {
      item[control.name] = control.value || PLACEHOLDER;
    });

    this.model.chips.chipsItems.forEach((current) => {
      if (current.item && current.item[this.model.mandatoryField] && current.item[this.model.mandatoryField] === item[this.model.mandatoryField]) {
        current.item = Object.assign({}, item);
        this.change.emit(event);
        this.editMode = false;
        this.group.reset();
      }
    });
  }

  removeChips(event) {
    // console.log("Removed chips index: "+event);
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
