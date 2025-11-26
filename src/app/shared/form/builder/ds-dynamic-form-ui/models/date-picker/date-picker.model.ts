import { MetadataValue } from '@dspace/core/shared/metadata.models';
import {
  isEmpty,
  isNotUndefined,
} from '@dspace/shared/utils/empty.util';
import { serializable } from "@ng-dynamic-forms/core/decorator/serializable.decorator";
import { DynamicDatePickerModelConfig } from "@ng-dynamic-forms/core/model/datepicker/dynamic-datepicker.model";
import { DynamicDateControlModel } from "@ng-dynamic-forms/core/model/dynamic-date-control.model";
import { DynamicFormControlModel } from "@ng-dynamic-forms/core/model/dynamic-form-control.model";
import { DynamicFormControlLayout } from "@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model";
import { DynamicFormControlRelation } from "@ng-dynamic-forms/core/model/misc/dynamic-form-control-relation.model";

import {
  BehaviorSubject,
  Subject,
} from 'rxjs';

export const DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER = 'DATE';

export interface DynamicDsDateControlModelConfig extends DynamicDatePickerModelConfig {
  legend?: string;
  typeBindRelations?: DynamicFormControlRelation[];
  repeatable: boolean;
}

/**
 * Dynamic Date Picker Model class
 */
export class DynamicDsDatePickerModel extends DynamicDateControlModel {
  @serializable() hiddenUpdates: Subject<boolean>;
  @serializable() typeBindRelations: DynamicFormControlRelation[];
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER;
  @serializable() metadataValue: MetadataValue;
  malformedDate: boolean;
  legend: string;
  hasLanguages = false;
  repeatable = false;

  constructor(config: DynamicDsDateControlModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.malformedDate = false;
    this.legend = config.legend;
    this.metadataValue = (config as any).metadataValue;
    this.typeBindRelations = config.typeBindRelations ? config.typeBindRelations : [];
    this.hiddenUpdates = new BehaviorSubject<boolean>(this.hidden);
    this.repeatable = config.repeatable;
    // This was a subscription, then an async setTimeout, but it seems unnecessary
    const parentModel = this.getRootParent(this);
    if (parentModel && isNotUndefined(parentModel.hidden)) {
      parentModel.hidden = this.hidden;
    }
  }

  private getRootParent(model: any): DynamicFormControlModel {
    if (isEmpty(model) || isEmpty(model.parent)) {
      return model;
    } else {
      return this.getRootParent(model.parent);
    }
  }

}
