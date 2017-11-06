import { Injectable } from '@angular/core';
import {
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
}
