import { serializable } from "@ng-dynamic-forms/core/decorator/serializable.decorator";
import {
  DynamicLookupModel,
  DynamicLookupModelConfig,
} from './dynamic-lookup.model';
import { DynamicFormControlLayout } from "@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model";

export const DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME = 'LOOKUP_NAME';

export interface DynamicLookupNameModelConfig extends DynamicLookupModelConfig {
  separator?: string;
  firstPlaceholder?: string;
  secondPlaceholder?: string;
}

export class DynamicLookupNameModel extends DynamicLookupModel {

  @serializable() separator: string;
  @serializable() secondPlaceholder: string;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME;

  constructor(config: DynamicLookupNameModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    this.separator = config.separator || ',';
    this.placeholder = config.firstPlaceholder || 'form.last-name';
    this.secondPlaceholder = config.secondPlaceholder || 'form.first-name';
  }
}
