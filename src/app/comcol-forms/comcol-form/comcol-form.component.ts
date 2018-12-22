import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import {
  DynamicFormService,
  DynamicInputModel
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core/src/model/dynamic-form-control.model';
import { TranslateService } from '@ngx-translate/core';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { isNotEmpty } from '../../shared/empty.util';
import { ResourceType } from '../../core/shared/resource-type';

@Component({
  selector: 'ds-comcol-form',
  // styleUrls: ['./comcol-form.component.scss'],
  templateUrl: './comcol-form.component.html'
})
export class ComColFormComponent<T extends DSpaceObject> implements OnInit {
  @Input() dso: T;
  type;
  LABEL_KEY_PREFIX = this.type + '.form.';
  ERROR_KEY_PREFIX = this.type + '.form.errors.';
  formModel: DynamicFormControlModel[];
  formGroup: FormGroup;

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

  private updateFieldTranslations() {
    this.formModel.forEach(
      (fieldModel: DynamicInputModel) => {
        fieldModel.label = this.translate.instant(this.LABEL_KEY_PREFIX + fieldModel.id);
        if (isNotEmpty(fieldModel.validators)) {
          fieldModel.errorMessages = {};
          Object.keys(fieldModel.validators).forEach((key) => {
            fieldModel.errorMessages[key] = this.translate.instant(this.ERROR_KEY_PREFIX + fieldModel.id + '.' + key);
          });
        }
      }
    );
  }
}
