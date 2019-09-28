import {
  DynamicDateControlModel,
  DynamicDatePickerModelConfig,
  DynamicFormControlLayout,
  DynamicFormControlModel,
  DynamicFormControlRelationGroup,
  serializable
} from '@ng-dynamic-forms/core';

import { BehaviorSubject, Subject } from 'rxjs';

import { isEmpty, isNotUndefined } from '../../../../../empty.util';

export const DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER = 'DATE';

export interface DynamicDsDatePickerModelConfig extends DynamicDatePickerModelConfig {
  typeBind?: DynamicFormControlRelationGroup[];
}

/**
 * Dynamic Date Picker Model class
 */
export class DynamicDsDatePickerModel extends DynamicDateControlModel {
  @serializable() hiddenUpdates: Subject<boolean>;
  @serializable() typeBind: DynamicFormControlRelationGroup[];
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER;
  valueUpdates: Subject<any>;
  malformedDate: boolean;
  hasLanguages = false;

  constructor(config: DynamicDsDatePickerModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.malformedDate = false;
    this.typeBind = config.typeBind ? config.typeBind : [];
    this.hiddenUpdates = new BehaviorSubject<boolean>(this.hidden);
    this.hiddenUpdates.subscribe((hidden: boolean) => {
      this.hidden = hidden;

      const parentModel = this.getRootParent(this);
      if (parentModel && isNotUndefined(parentModel.hidden)) {
        parentModel.hidden = hidden;
      }

    });
  }

  private getRootParent(model: any): DynamicFormControlModel {
    if (isEmpty(model) || isEmpty(model.parent)) {
      return model;
    } else {
      return this.getRootParent(model.parent);
    }
  }
}
