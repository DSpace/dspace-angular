import { Subject } from 'rxjs/Subject';

import {
  DynamicCheckboxGroupModel, DynamicFormControlLayout,
  DynamicFormGroupModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { AuthorityModel } from '../../../../../../core/integration/models/authority.model';

export interface DynamicListCheckboxGroupModelConfig extends DynamicFormGroupModelConfig {
  authorityMetadata: string;
  authorityName: string;
  authorityScope: string;
  groupLength: number;
  repeatable: boolean;
  value?: any;
}

export class DynamicListCheckboxGroupModel extends DynamicCheckboxGroupModel {

  @serializable() authorityMetadata: string;
  @serializable() authorityName: string;
  @serializable() authorityScope: string;
  @serializable() repeatable: boolean;
  @serializable() groupLength: number;
  @serializable() _value: AuthorityModel[];
  valueUpdates: Subject<any>;

  constructor(config: DynamicListCheckboxGroupModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);

    this.authorityMetadata = config.authorityMetadata;
    this.authorityName = config.authorityName;
    this.authorityScope = config.authorityScope;
    this.groupLength = config.groupLength || 5;
    this._value = [];
    this.repeatable = config.repeatable;

    this.valueUpdates = new Subject<any>();
    this.valueUpdates.subscribe((value: AuthorityModel | AuthorityModel[]) => this.value = value);
    this.valueUpdates.next(config.value);
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
