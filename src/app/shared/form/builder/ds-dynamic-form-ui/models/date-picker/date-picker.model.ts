import {
  DynamicDateControlModel,
  DynamicDatePickerModelConfig,
  DynamicFormControlLayout,
  DynamicFormControlModel,
  DynamicFormControlRelation,
  serializable
} from '@ng-dynamic-forms/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { isEmpty, isNotEmpty, isNotUndefined } from '../../../../../empty.util';
import { MetadataValue } from '../../../../../../core/shared/metadata.models';

export const DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER = 'DATE';

export interface DynamicDsDatePickerModelConfig extends DynamicDatePickerModelConfig {
  legend?: string;
  typeBindRelations?: DynamicFormControlRelation[];
  repeatable: boolean;
  securityLevel?: number;
  securityConfigLevel?: number[];
  toggleSecurityVisibility?: boolean;
}

/**
 * Dynamic Date Picker Model class
 */
export class DynamicDsDatePickerModel extends DynamicDateControlModel {
  @serializable() hiddenUpdates: Subject<boolean>;
  @serializable() typeBindRelations: DynamicFormControlRelation[];
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER;
  @serializable() metadataValue: MetadataValue;
  @serializable() securityLevel?: number;
  @serializable() securityConfigLevel?: number[];
  @serializable() toggleSecurityVisibility = true;
  malformedDate: boolean;
  legend: string;
  hasLanguages = false;
  repeatable = false;

  constructor(config: DynamicDsDatePickerModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.malformedDate = false;
    this.legend = config.legend;
    this.metadataValue = (config as any).metadataValue;
    this.securityLevel = config.securityLevel;
    this.securityConfigLevel = config.securityConfigLevel;
    if (isNotUndefined(config.toggleSecurityVisibility)) {
      this.toggleSecurityVisibility = config.toggleSecurityVisibility;
    }
    this.typeBindRelations = config.typeBindRelations ? config.typeBindRelations : [];
    this.repeatable = config.repeatable;
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

  get hasSecurityLevel(): boolean {
    return isNotEmpty(this.securityLevel);
  }

  get hasSecurityToggle(): boolean {
    return isNotEmpty(this.securityConfigLevel) && this.securityConfigLevel.length > 1 && this.toggleSecurityVisibility;
  }
}
