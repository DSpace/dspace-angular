import { Subject } from 'rxjs';

import {
  DynamicCheckboxGroupModel, DynamicFormControlLayout,
  DynamicFormGroupModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { AuthorityValue } from '../../../../../../core/integration/models/authority.value';
import { AuthorityOptions } from '../../../../../../core/integration/models/authority-options.model';
import { hasValue } from '../../../../../empty.util';

export interface DynamicListCheckboxGroupModelConfig extends DynamicFormGroupModelConfig {
  authorityOptions: AuthorityOptions;
  groupLength?: number;
  repeatable: boolean;
  value?: any;
}

export class DynamicListCheckboxGroupModel extends DynamicCheckboxGroupModel {

  @serializable() authorityOptions: AuthorityOptions;
  @serializable() repeatable: boolean;
  @serializable() groupLength: number;
  @serializable() _value: AuthorityValue[];
  isListGroup = true;
  valueUpdates: Subject<any>;

  constructor(config: DynamicListCheckboxGroupModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);

    this.authorityOptions = config.authorityOptions;
    this.groupLength = config.groupLength || 5;
    this._value = [];
    this.repeatable = config.repeatable;

    this.valueUpdates = new Subject<any>();
    this.valueUpdates.subscribe((value: AuthorityValue | AuthorityValue[]) => this.value = value);
    this.valueUpdates.next(config.value);
  }

  get hasAuthority(): boolean {
    return this.authorityOptions && hasValue(this.authorityOptions.name);
  }

  get value() {
    return this._value;
  }

  set value(value: AuthorityValue | AuthorityValue[]) {
    if (value) {
      if (Array.isArray(value)) {
        this._value = value;
      } else {
        // _value is non extendible so assign it a new array
        const newValue = (this.value as AuthorityValue[]).concat([value]);
        this._value = newValue
      }
    }
  }
}
