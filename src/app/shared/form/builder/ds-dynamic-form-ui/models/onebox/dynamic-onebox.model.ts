import { serializable } from '@ng-dynamic-forms/core/decorator/serializable.decorator';
import { DynamicFormControlLayout } from '@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model';
import { AUTOCOMPLETE_OFF } from '@ng-dynamic-forms/core/utils/autofill.utils';

import {
  DsDynamicInputModel,
  DsDynamicInputModelConfig,
} from '../ds-dynamic-input.model';

export const DYNAMIC_FORM_CONTROL_TYPE_ONEBOX = 'ONEBOX';

export interface DsDynamicOneboxModelConfig extends DsDynamicInputModelConfig {
  minChars?: number;
  value?: any;
}

export class DynamicOneboxModel extends DsDynamicInputModel {

  @serializable() minChars: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_ONEBOX;

  constructor(config: DsDynamicOneboxModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.minChars = config.minChars || 3;
  }

}
