import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import {
  DynamicFormService,
  DynamicInputModel
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core/src/model/dynamic-form-control.model';
import { TranslateService } from '@ngx-translate/core';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { isNotEmpty } from '../../empty.util';
import { ResourceType } from '../../../core/shared/resource-type';

/**
 * A form for creating and editing Communities or Collections
 */
@Component({
  selector: 'ds-comcol-form',
  styleUrls: ['./comcol-form.component.scss'],
  templateUrl: './comcol-form.component.html'
})
export class ComColFormComponent<T extends DSpaceObject> implements OnInit {
  /**
   * DSpaceObject that the form represents
   */
  @Input() dso: T;

  /**
   * Type of DSpaceObject that the form represents
   */
  protected type;

  /**
   * @type {string} Key prefix used to generate form labels
   */
  LABEL_KEY_PREFIX = '.form.';

  /**
   * @type {string} Key prefix used to generate form error messages
   */
  ERROR_KEY_PREFIX = '.form.errors.';

  /**
   * The form model that represents the fields in the form
   */
  formModel: DynamicFormControlModel[];

  /**
   * The form group of this form
   */
  formGroup: FormGroup;

  /**
   * Emits DSO when the form is submitted
   * @type {EventEmitter<any>}
   */
  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  public constructor(private location: Location,
                     private formService: DynamicFormService,
                     private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.formModel.forEach(
      (fieldModel: DynamicInputModel) => {
        fieldModel.value = this.dso.findMetadata(fieldModel.name);
      }
    );
    this.formGroup = this.formService.createFormGroup(this.formModel);

    this.updateFieldTranslations();
    this.translate.onLangChange
      .subscribe(() => {
        this.updateFieldTranslations();
      });
  }

  /**
   * Checks which new fields where added and sends the updated version of the DSO to the parent component
   */
  onSubmit() {
    const metadata = this.formModel.map(
      (fieldModel: DynamicInputModel) => {
        return { key: fieldModel.name, value: fieldModel.value }
      }
    );
    const filteredOldMetadata = this.dso.metadata.filter((filter) => !metadata.map((md) => md.key).includes(filter.key));
    const filteredNewMetadata = metadata.filter((md) => isNotEmpty(md.value));

    const newMetadata = [...filteredOldMetadata, ...filteredNewMetadata];
    const updatedDSO = Object.assign({}, this.dso, {
      metadata: newMetadata,
      type: ResourceType.Community
    });
    this.submitForm.emit(updatedDSO);
  }

  /**
   * Used the update translations of errors and labels on init and on language change
   */
  private updateFieldTranslations() {
    this.formModel.forEach(
      (fieldModel: DynamicInputModel) => {
        fieldModel.label = this.translate.instant(this.type + this.LABEL_KEY_PREFIX + fieldModel.id);
        if (isNotEmpty(fieldModel.validators)) {
          fieldModel.errorMessages = {};
          Object.keys(fieldModel.validators).forEach((key) => {
            fieldModel.errorMessages[key] = this.translate.instant(this.type + this.ERROR_KEY_PREFIX + fieldModel.id + '.' + key);
          });
        }
      }
    );
  }

  onCancel() {
    this.location.back();
  }
}
