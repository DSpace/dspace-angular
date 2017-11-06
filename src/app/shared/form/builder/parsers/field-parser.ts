import { ClsConfig } from '@ng-dynamic-forms/core';
import { hasValue, isNotUndefined, isUndefined } from '../../../empty.util';
import { FormFieldModel } from '../models/form-field.model';

import AUTHORITY from '../../../../../backend/data/authority.json';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { Observable } from 'rxjs/Observable';
import { AuthorityOptions } from '../models/authority-options.model';
import { SubmissionFormsConfigService } from '../../../../core/config/submission-forms-config.service';
import { DynamicScrollableDropdownResponseModel } from '../ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { Inject, InjectionToken, ReflectiveInjector } from '@angular/core';
import { ResponseCacheService } from '../../../../core/cache/response-cache.service';
import { RequestService } from '../../../../core/data/request.service';
import { StateObservable, Store } from '@ngrx/store';
export const CONFIG_SERVICE: InjectionToken<SubmissionFormsConfigService> = new InjectionToken<SubmissionFormsConfigService>('formConfigService');

export abstract class FieldParser {

  constructor(protected configData: FormFieldModel) { }

  public abstract parse(): any;

  protected initModel(id?: string, label = true, labelEmpty = false) {

    const controlModel = Object.create(null);

    // Sets input ID and name
    const inputId = id ? id : this.configData.selectableMetadata[0].metadata;
    controlModel.id = (inputId).replace(/\./g, '_');
    controlModel.name = inputId;

    // Checks if field has multiple values and sets options available
    if (isNotUndefined(this.configData.selectableMetadata) && this.configData.selectableMetadata.length > 1) {
      controlModel.options = [];
      this.configData.selectableMetadata.forEach((option, key) => {
        if (key === 0) {
          controlModel.value = option.metadata
        }
        controlModel.options.push({label: option.label, value: option.metadata})
      });
    }

    if (label) {
      controlModel.label = (labelEmpty) ? '&nbsp;' : this.configData.label;
    }

    controlModel.placeholder = this.configData.label;

    if (this.configData.mandatory) {
      controlModel.required = true;
      controlModel.validators = Object.assign({}, controlModel.validators, {required: null});
      controlModel.errorMessages = Object.assign(
        {},
        controlModel.errorMessages,
        {required: this.configData.mandatoryMessage});
    }
    if (this.configData.value) {
      controlModel.value = this.configData.value;
    }

    return controlModel;
  }



  public getAuthorityOptionsObj(uuid, name, metadata): AuthorityOptions {
    const authorityOptions: AuthorityOptions = new AuthorityOptions(uuid);

    authorityOptions.name = name;
    authorityOptions.metadata = metadata;

    return authorityOptions;
  }
}
