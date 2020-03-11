import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
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
import { FormService } from '../../shared/form/form.service';
import { FormBuilderService } from '../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../shared/form/form.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';

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

  NOTIFICATION_PREFIX = 'profile.metadata.form.notifications.';

  /**
   * All of the configured active languages
   */
  activeLangs: LangConfig[];

  constructor(@Inject(GLOBAL_CONFIG) protected config: GlobalConfig,
              protected location: Location,
              protected formBuilderService: FormBuilderService,
              protected translate: TranslateService,
              protected epersonService: EPersonDataService,
              protected notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.activeLangs = this.config.languages.filter((MyLangConfig) => MyLangConfig.active === true);
    this.setFormValues();
    this.updateFieldTranslations();
    this.translate.onLangChange
      .subscribe(() => {
        this.updateFieldTranslations();
      });
  }

  setFormValues() {
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
    this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
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

  updateProfile(): boolean {
    if (!this.formGroup.valid) {
      return false;
    }

    const newMetadata = cloneDeep(this.user.metadata);
    let changed = false;
    this.formModel.filter((fieldModel) => fieldModel.id !== 'email').forEach((fieldModel: DynamicFormValueControlModel<string>) => {
      if (newMetadata.hasOwnProperty(fieldModel.name) && newMetadata[fieldModel.name].length > 0) {
        if (hasValue(fieldModel.value)) {
          if (newMetadata[fieldModel.name][0].value !== fieldModel.value) {
            newMetadata[fieldModel.name][0].value = fieldModel.value;
            changed = true;
          }
        } else {
          newMetadata[fieldModel.name] = [];
          changed = true;
        }
      } else if (hasValue(fieldModel.value)) {
        newMetadata[fieldModel.name] = [{
          value: fieldModel.value,
          language: null
        } as any];
        changed = true;
      }
    });

    if (changed) {
      this.epersonService.update(Object.assign(cloneDeep(this.user), {metadata: newMetadata})).pipe(
        getSucceededRemoteData(),
        getRemoteDataPayload()
      ).subscribe((user) => {
        this.user = user;
        this.setFormValues();
        this.notificationsService.success(
          this.translate.instant(this.NOTIFICATION_PREFIX + 'success.title'),
          this.translate.instant(this.NOTIFICATION_PREFIX + 'success.content')
        );
      });
    }

    return changed;
  }
}
