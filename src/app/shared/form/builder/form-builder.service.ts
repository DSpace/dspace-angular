import { Injectable } from '@angular/core';
import {
  DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
  DYNAMIC_FORM_CONTROL_TYPE_GROUP,
  DynamicFormArrayModel, DynamicFormControlEvent,
  DynamicFormControlModel, DynamicFormService, DynamicFormValidationService,
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
import { FormBuilder } from '@angular/forms';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import { isNotNull, isNull } from '../../empty.util';
import {
  COMBOBOX_METADATA_SUFFIX, COMBOBOX_VALUE_SUFFIX,
  DynamicComboboxModel
} from './ds-dynamic-form-ui/models/ds-dynamic-combobox.model';

@Injectable()
export class FormBuilderService extends DynamicFormService {

  protected authorityOptions: AuthorityOptions;

  constructor(private formsConfigService: SubmissionFormsConfigService,
              formBuilder: FormBuilder,
              validationService: DynamicFormValidationService,
              ) {
    super(formBuilder, validationService);
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
          group.push(new DropdownFieldParser(fieldData, this.authorityOptions.uuid, this.formsConfigService).parse());
          break;

        case 'lookup':
          // group.push(new LookupFieldParser(fieldData).parse());
          break;

        case 'onebox':
          group.push(new OneboxFieldParser(fieldData, this.authorityOptions.uuid, this.formsConfigService).parse());
          break;

        case 'list':
          group.push(new ListFieldParser(fieldData).parse());
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
        const metadataControl = event.group.get(metadataId);
        fieldId = event.group.get(metadataId).value
      } else {
        fieldId = event.control.value;
      }
    } else {
      fieldId = event.model.name;
    }
    return fieldId + fieldIndex;
  }
}
