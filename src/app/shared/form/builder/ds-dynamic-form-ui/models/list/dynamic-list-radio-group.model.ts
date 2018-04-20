import {
  DynamicFormControlLayout,
  DynamicRadioGroupModel,
  DynamicRadioGroupModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { AuthorityOptions } from '../../../../../../core/integration/models/authority-options.model';

export interface DynamicListModelConfig extends DynamicRadioGroupModelConfig<any> {
  authorityOptions: AuthorityOptions;
  groupLength: number;
  repeatable: boolean;
  value?: any;
}

export class DynamicListRadioGroupModel extends DynamicRadioGroupModel<any> {

  @serializable() authorityOptions: AuthorityOptions;
  @serializable() repeatable: boolean;
  @serializable() groupLength: number;

  constructor(config: DynamicListModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);

    this.authorityOptions = config.authorityOptions;
    this.groupLength = config.groupLength || 5;
    this.repeatable = config.repeatable;
    this.valueUpdates.next(config.value);
  }

}
