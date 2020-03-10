import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  DynamicFormControlModel,
  DynamicFormService, DynamicFormValueControlModel,
  DynamicInputModel, DynamicSelectModel
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { LangConfig } from '../../../config/lang-config.interface';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { cloneDeep } from 'lodash';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../core/shared/operators';

@Component({
  selector: 'ds-profile-page-metadata-form',
  templateUrl: './profile-page-metadata-form.component.html'
})
export class ProfilePageMetadataFormComponent implements OnInit {
  /**
   * The user to display the form for
   */
  @Input() user: EPerson;

  formModel: DynamicFormControlModel[] = [
    new DynamicInputModel({
      id: 'email',
      name: 'email',
      readOnly: true
    }),
    new DynamicInputModel({
      id: 'firstname',
      name: 'eperson.firstname',
      required: true,
      validators: {
        required: null
      },
      errorMessages: {
        required: 'This field is required'
      },
    }),
    new DynamicInputModel({
      id: 'lastname',
      name: 'eperson.lastname',
      required: true,
      validators: {
        required: null
      },
      errorMessages: {
        required: 'This field is required'
      },
    }),
    new DynamicInputModel({
      id: 'phone',
      name: 'eperson.phone'
    }),
    new DynamicSelectModel<string>({
      id: 'language',
      name: 'eperson.language'
    })
  ];

  /**
   * The form group of this form
   */
  formGroup: FormGroup;

  LABEL_PREFIX = 'profile.metadata.form.label.';

  ERROR_PREFIX = 'profile.metadata.form.error.';

  /**
   * All of the configured active languages
   */
  activeLangs: LangConfig[];

  constructor(@Inject(GLOBAL_CONFIG) protected config: GlobalConfig,
              protected location: Location,
              protected formService: DynamicFormService,
              protected translate: TranslateService,
              protected epersonService: EPersonDataService) {
  }

  ngOnInit(): void {
    this.activeLangs = this.config.languages.filter((MyLangConfig) => MyLangConfig.active === true);
    this.formModel.forEach(
      (fieldModel: DynamicInputModel | DynamicSelectModel<string>) => {
        if (fieldModel.name === 'email') {
          fieldModel.value = this.user.email;
        } else {
          fieldModel.value = this.user.firstMetadataValue(fieldModel.name);
        }
        if (fieldModel.id === 'language') {
          (fieldModel as DynamicSelectModel<string>).options =
            this.activeLangs.map((langConfig) => Object.assign({ value: langConfig.code, label: langConfig.label }))
        }
      }
    );
    this.formGroup = this.formService.createFormGroup(this.formModel);
    this.updateFieldTranslations();
    this.translate.onLangChange
      .subscribe(() => {
        this.updateFieldTranslations();
      });
  }

  updateFieldTranslations() {
    this.formModel.forEach(
      (fieldModel: DynamicInputModel) => {
        fieldModel.label = this.translate.instant(this.LABEL_PREFIX + fieldModel.id);
        if (isNotEmpty(fieldModel.validators)) {
          fieldModel.errorMessages = {};
          Object.keys(fieldModel.validators).forEach((key) => {
            fieldModel.errorMessages[key] = this.translate.instant(this.ERROR_PREFIX + fieldModel.id + '.' + key);
          });
        }
      }
    );
  }

  updateProfile() {
    const newMetadata = Object.assign({}, this.user.metadata);
    this.formModel.forEach((fieldModel: DynamicFormValueControlModel<string>) => {
      if (newMetadata.hasOwnProperty(fieldModel.name) && newMetadata[fieldModel.name].length > 0) {
        if (hasValue(fieldModel.value)) {
          newMetadata[fieldModel.name][0].value = fieldModel.value;
        } else {
          newMetadata[fieldModel.name] = [];
        }
      } else if (hasValue(fieldModel.value)) {
        newMetadata[fieldModel.name] = [{
          value: fieldModel.value,
          language: null
        } as any];
      }
    });
    this.epersonService.update(Object.assign(cloneDeep(this.user), { metadata: newMetadata })).pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload()
    ).subscribe((user) => {
      this.user = user;
    });
  }
}
