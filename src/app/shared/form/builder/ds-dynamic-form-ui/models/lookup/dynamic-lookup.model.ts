import { serializable } from '@ng-dynamic-forms/core/decorator/serializable.decorator';
import { DynamicFormControlLayout } from '@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model';
import { AUTOCOMPLETE_OFF } from '@ng-dynamic-forms/core/utils/autofill.utils';

import {
  DsDynamicInputModel,
  DsDynamicInputModelConfig,
} from '../ds-dynamic-input.model';

export const DYNAMIC_FORM_CONTROL_TYPE_LOOKUP = 'LOOKUP';

export interface DynamicLookupModelConfig extends DsDynamicInputModelConfig {
  maxOptions?: number;
  value?: any;
}

export class DynamicLookupModel extends DsDynamicInputModel {

  @serializable() maxOptions: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LOOKUP;

  constructor(config: DynamicLookupModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.maxOptions = config.maxOptions || 10;

    this.value = config.value;
  }
}
