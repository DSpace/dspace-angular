import { ClsConfig, DynamicDateControlModel, serializable } from '@ng-dynamic-forms/core';
import { DynamicDateControlModelConfig } from '@ng-dynamic-forms/core/src/model/dynamic-date-control.model';
import { DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD } from '../typeahead/dynamic-typeahead.model';
import { Subject } from 'rxjs/Subject';

export const DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER = 'DSDATEPICKER';

/**
 * Dynamic Date Picker Model class
 */
export class DynamicDsDatePickerModel extends DynamicDateControlModel {
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER;
  valueUpdates: Subject<any>;
  malformedDate: boolean;

  constructor(config: DynamicDateControlModelConfig, cls?: ClsConfig) {
    super(config, cls);
    this.malformedDate = false;
  }
}
