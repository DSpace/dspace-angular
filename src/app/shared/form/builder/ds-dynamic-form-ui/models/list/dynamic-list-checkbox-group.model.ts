import { Subject } from 'rxjs/Subject';

import {
  DynamicCheckboxGroupModel, DynamicFormControlLayout,
  DynamicFormGroupModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { AuthorityModel } from '../../../../../../core/integration/models/authority.model';
import { AuthorityOptions } from '../../../../../../core/integration/models/authority-options.model';
import { hasValue } from '../../../../../empty.util';

export interface DynamicListCheckboxGroupModelConfig extends DynamicFormGroupModelConfig {
  authorityOptions: AuthorityOptions;
  groupLength: number;
  repeatable: boolean;
  value?: any;
}

export class DynamicListCheckboxGroupModel extends DynamicCheckboxGroupModel {

  @serializable() authorityOptions: AuthorityOptions;
  @serializable() repeatable: boolean;
  @serializable() groupLength: number;
  @serializable() _value: AuthorityModel[];
  valueUpdates: Subject<any>;

  constructor(config: DynamicListCheckboxGroupModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);

    this.authorityOptions = config.authorityOptions;
    this.groupLength = config.groupLength || 5;
    this._value = [];
    this.repeatable = config.repeatable;

    this.valueUpdates = new Subject<any>();
    this.valueUpdates.subscribe((value: AuthorityModel | AuthorityModel[]) => this.value = value);
    this.valueUpdates.next(config.value);
  }

  get hasAuthority(): boolean {
    return this.authorityOptions && hasValue(this.authorityOptions.name);
  }

  get value() {
    return this._value;
  }

  set value(value: AuthorityModel | AuthorityModel[]) {
    if (value) {
      if (Array.isArray(value)) {
        this._value = value;
      } else {
        // _value is non extendible so assign it a new array
        const newValue = (this.value as AuthorityModel[]).concat([value]);
        this._value = newValue
      }
    }
  }
}
