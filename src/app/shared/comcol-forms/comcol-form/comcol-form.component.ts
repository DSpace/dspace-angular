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
import { MetadataMap, MetadataValue } from '../../../core/shared/metadata.models';
import { ResourceType } from '../../../core/shared/resource-type';
import { isNotEmpty } from '../../empty.util';
import { Community } from '../../../core/shared/community.model';

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
  protected type: ResourceType;

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
        fieldModel.value = this.dso.firstMetadataValue(fieldModel.name);
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
   * Checks which new fields were added and sends the updated version of the DSO to the parent component
   */
  onSubmit() {
    const formMetadata = new Object() as MetadataMap;
    this.formModel.forEach((fieldModel: DynamicInputModel) => {
      const value: MetadataValue = {
          value: fieldModel.value as string,
          language: null
        } as any;
      if (formMetadata.hasOwnProperty(fieldModel.name)) {
        formMetadata[fieldModel.name].push(value);
      } else {
        formMetadata[fieldModel.name] = [value];
      }
    });

    const updatedDSO = Object.assign({}, this.dso, {
      metadata: {
        ...this.dso.metadata,
        ...formMetadata
      },
      type: Community.type
    });
    this.submitForm.emit(updatedDSO);
  }

  /**
   * Used the update translations of errors and labels on init and on language change
   */
  private updateFieldTranslations() {
    this.formModel.forEach(
      (fieldModel: DynamicInputModel) => {
        fieldModel.label = this.translate.instant(this.type.value + this.LABEL_KEY_PREFIX + fieldModel.id);
        if (isNotEmpty(fieldModel.validators)) {
          fieldModel.errorMessages = {};
          Object.keys(fieldModel.validators).forEach((key) => {
            fieldModel.errorMessages[key] = this.translate.instant(this.type.value + this.ERROR_KEY_PREFIX + fieldModel.id + '.' + key);
          });
        }
      }
    );
  }

  onCancel() {
    this.location.back();
  }
}
