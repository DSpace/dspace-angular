import {
  AUTOCOMPLETE_OFF, ClsConfig, DynamicCheckboxGroupModel, DynamicFormGroupModelConfig, DynamicInputModel,
  DynamicInputModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { Observable } from 'rxjs/Observable';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { AuthorityModel } from '../../../../../../core/integration/models/authority.model';

export const DYNAMIC_FORM_CONTROL_TYPE_LIST = 'TYPELIST';

export interface DynamicListModelConfig extends DynamicFormGroupModelConfig {
  authorityMetadata: string;
  authorityName: string;
  authorityScope: string;
  repeatable: boolean;
  value: any;
}

export class DynamicListModel extends DynamicCheckboxGroupModel {

  @serializable() authorityMetadata: string;
  @serializable() authorityName: string;
  @serializable() authorityScope: string;
  repeatable: boolean;
  @serializable() items: ListItem[][];
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LIST;

  constructor(config: DynamicListModelConfig, cls?: ClsConfig) {
    super(config, cls);

    this.authorityMetadata = config.authorityMetadata;
    this.authorityName = config.authorityName;
    this.authorityScope = config.authorityScope;
    this.repeatable = config.repeatable;
    this.items = [];
  }

  // get value() {
  //   const checkedItems = [];
  //   this.items.forEach((itemsRow) => {
  //     itemsRow.forEach((item) => {
  //       if(item.checked) {
  //         checkedItems.push({
  //           id: item.value,
  //           display: item.label,
  //           value: item.label,
  //           otherInformation: {value: item.label}
  //         } as AuthorityModel);
  //       }
  //     });
  //   });
  //   if(checkedItems.length ===1 ){
  //     return checkedItems[0];
  //   } else {
  //     return checkedItems;
  //   }
  // }

}

export interface ListItem {
  label,
  value,
  checked,
  groupIndex?,
  index?

};
