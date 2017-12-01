import { Inject, Injectable } from '@angular/core';
import {
  DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
  DYNAMIC_FORM_CONTROL_TYPE_GROUP, DynamicFormArrayGroupModel,
  DynamicFormArrayModel, DynamicFormControlEvent,
  DynamicFormControlModel, DynamicFormGroupModel, DynamicFormService, DynamicFormValidationService,
  Utils
} from '@ng-dynamic-forms/core';

import { DateFieldParser } from './parsers/date-field-parser';
import { DropdownFieldParser } from './parsers/dropdown-field-parser';
import { TextareaFieldParser } from './parsers/textarea-field-parser';
import { ListFieldParser } from './parsers/list-field-parser';
import { OneboxFieldParser } from './parsers/onebox-field-parser';
import { SeriesFieldParser } from './parsers/series-field-parser';
import { NameFieldParser } from './parsers/name-field-parser';
import { TwoboxFieldParser } from './parsers/twobox-field-parser';
import { LookupFieldParser } from './parsers/lookup-field-parser';
import { AuthorityOptions } from './models/authority-options.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import { isNotEmpty, isNotNull, isNull } from '../../empty.util';
import {
  COMBOBOX_METADATA_SUFFIX, COMBOBOX_VALUE_SUFFIX,
  DynamicComboboxModel
} from './ds-dynamic-form-ui/models/ds-dynamic-combobox.model';
import { ConfigAuthorityModel } from '../../../core/shared/config/config-authority.model';
import { GLOBAL_CONFIG } from '../../../../config';
import { GlobalConfig } from '../../../../config/global-config.interface';
import { DynamicTypeaheadModel } from './ds-dynamic-form-ui/models/typeahead/dynamic-typeahead.model';
import { DynamicScrollableDropdownModel } from './ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';

@Injectable()
export class FormBuilderService extends DynamicFormService {

  protected authorityOptions: AuthorityOptions;

  constructor(private formsConfigService: SubmissionFormsConfigService,
              formBuilder: FormBuilder,
              validationService: DynamicFormValidationService,
              @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig
              ) {
    super(formBuilder, validationService);
  }

  findById(id: string, groupModel: DynamicFormControlModel[], fieldIndex = 0): DynamicFormControlModel | null {

    let result = null;
    const findByIdFn = (findId: string, findGroupModel: DynamicFormControlModel[]): void => {

        for (const controlModel of findGroupModel) {

          if (controlModel.id === findId) {
            result = controlModel;
            break;
          }

          if (controlModel instanceof DynamicFormGroupModel) {
            findByIdFn(findId, (controlModel as DynamicFormGroupModel).group);
          }

          if (controlModel instanceof DynamicFormArrayModel) {
            findByIdFn(findId, controlModel.get(fieldIndex).group);
          }
        }
      };

    findByIdFn(id, groupModel);

    return result;
  }

  modelFromConfiguration(json: string | any): DynamicFormControlModel[] | never {

    const raw = Utils.isString(json) ? JSON.parse(json as string, Utils.parseJSONReviver) : json;
    const group: DynamicFormControlModel[] = [];

    raw.fields.forEach((fieldData: any) => {
      switch (fieldData.input.type) {
        case 'date':
          group.push(new DateFieldParser(fieldData).parse());
          break;

        case 'dropdown':
          group.push(new DropdownFieldParser(fieldData, this.authorityOptions.uuid, this.formsConfigService, this.EnvConfig).parse());
          break;

        case 'lookup':
          // group.push(new LookupFieldParser(fieldData).parse());
          break;

        case 'onebox':
          group.push(new OneboxFieldParser(fieldData, this.authorityOptions.uuid, this.formsConfigService, this.EnvConfig).parse());
          break;

        case 'list':
          group.push(new ListFieldParser(fieldData, this.authorityOptions.uuid, this.formsConfigService, this.EnvConfig).parse());
          break;

        case 'name':
          // group.push(new NameFieldParser(fieldData).parse());
          break;

        case 'series':
          // group.push(new SeriesFieldParser(fieldData).parse());
          break;

        case 'textarea':
          group.push(new TextareaFieldParser(fieldData).parse());
          break;

        case 'twobox':
          // group.push(new TwoboxFieldParser(fieldData).parse());
          break;

        default:
          throw new Error(`unknown form control model type defined on JSON object with label "${fieldData.label}"`);
      }
    });

    return group;
  }

  setAuthorityUuid(uuid: string) {
    this.authorityOptions = new AuthorityOptions(uuid);
  }

  getFieldPathFromChangeEvent(event: DynamicFormControlEvent) {
    let fieldIndex = '';
    let fieldId;
    if (isNull(event.context)) {
      if (isNotNull(event.model.parent)) {
        if ((event.model.parent as any).type === DYNAMIC_FORM_CONTROL_TYPE_GROUP) {
          if (isNotNull((event.model.parent as any).parent)) {
            if (isNotNull((event.model.parent as any).parent.context)) {
              if ((event.model.parent as any).parent.context.type === DYNAMIC_FORM_CONTROL_TYPE_ARRAY) {
                fieldIndex = '/' + (event.model.parent as any).parent.index;
              }
            }
          }
        }
      }
    } else {
      fieldIndex = '/' + event.context.index;
    }
    if (event.model.parent instanceof DynamicComboboxModel) {
      if (event.model.id.endsWith(COMBOBOX_VALUE_SUFFIX)) {
        const metadataId = event.model.id.replace(COMBOBOX_VALUE_SUFFIX, COMBOBOX_METADATA_SUFFIX);
        fieldId = event.group.get(metadataId).value
      } else {
        fieldId = event.control.value;
      }
    } else {
      fieldId = event.model.name;
    }
    return fieldId + fieldIndex;
  }

  getFieldValueFromChangeEvent(event: DynamicFormControlEvent) {
    let fieldValue;
    if (event.model.parent instanceof DynamicComboboxModel) {
      if (event.model.id.endsWith(COMBOBOX_METADATA_SUFFIX)) {
        const valueId = event.model.id.replace(COMBOBOX_METADATA_SUFFIX, COMBOBOX_VALUE_SUFFIX);
        fieldValue = event.group.get(valueId).value
      } else {
        fieldValue = event.control.value;
      }
    } else if (event.$event instanceof ConfigAuthorityModel) {
      if (isNotNull(event.$event.id)) {
        fieldValue = { value: event.$event.value, id: event.$event.id, confidence: 600 }
      } else {
        fieldValue = { value: event.$event.value }
      }
    }else if ((typeof event.control.value === 'object')) {
      fieldValue = [];
      Object.keys(event.control.value)
        .forEach((key) => {
          if (event.control.value[key]) {
            fieldValue.push({ value: key })
          }
        })
    } else {
      fieldValue = event.control.value;
    }
    return fieldValue;
  }

  hasAuthorityValue(fieldModel) {
    return (fieldModel instanceof DynamicTypeaheadModel || fieldModel instanceof DynamicScrollableDropdownModel);
  }

  getFormControlById(id: string, formGroup: FormGroup, groupModel: DynamicFormControlModel[]) {
    const fieldModel = this.findById(id, groupModel);
    return isNotEmpty(fieldModel) ? formGroup.get(this.getPath(fieldModel)) : null;
  }
}
