import {
  ClsConfig, DynamicFormArrayModel,
  DynamicFormGroupModel,
  DynamicInputModel,
  DynamicInputModelConfig,
  DynamicSelectModel,
  DynamicSelectModelConfig
} from '@ng-dynamic-forms/core';

import { FieldParser } from './field-parser';
import { deleteProperty } from '../../../object.util';
import {
  DynamicTypeaheadModel, DynamicTypeaheadModelConfig,
  DynamicTypeaheadResponseModel
} from '../ds-dynamic-form-ui/models/typeahead/dynamic-typeahead.model';
import { FormFieldModel } from '../models/form-field.model';
import { AuthorityOptions } from '../models/authority-options.model';
import { Observable } from 'rxjs/Observable';
import { SubmissionFormsConfigService } from '../../../../core/config/submission-forms-config.service';
import { hasValue, isUndefined } from '../../../empty.util';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { ConfigData } from '../../../../core/config/config-data';

export class OneboxFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel,
              protected authorityUuid: string,
              protected formsConfigService: SubmissionFormsConfigService) {
    super(configData);
  }

  public modelFactory(): any {
    if (this.configData.selectableMetadata.length > 1) {
      let clsGroup: ClsConfig;
      let clsSelect: ClsConfig;
      let clsInput: ClsConfig;
      const newId = this.configData.selectableMetadata[0].metadata
        .split('.')
        .slice(0, this.configData.selectableMetadata[0].metadata.split('.').length - 1)
        .join('.');

      const inputSelectGroup: DynamicFormGroupModel = Object.create(null);
      inputSelectGroup.id = newId.replace(/\./g, '_') + '_group';
      inputSelectGroup.group = [];
      inputSelectGroup.legend = this.configData.label;

      const selectModelConfig: DynamicSelectModelConfig<any> = this.initModel(  newId + '.metadata');
      this.setOptions(selectModelConfig);
      clsSelect = {
        element: {
          control: 'input-group-addon ds-form-input-addon',
        },
        grid: {
          host: 'col-sm-4 pr-0'
        }
      };
      const sel = new DynamicSelectModel(selectModelConfig, clsSelect);
      inputSelectGroup.group.push(new DynamicSelectModel(selectModelConfig, clsSelect));

      const inputModelConfig: DynamicInputModelConfig = this.initModel(newId + '.value', true, true);
      clsInput = {
        element: {
          control: 'ds-form-input-value',
        },
        grid: {
          host: 'col-sm-8 pl-0'
        }
      };
      const inp = new DynamicInputModel(inputModelConfig, clsInput);
      inputSelectGroup.group.push(new DynamicInputModel(inputModelConfig, clsInput));

      clsGroup = {
        element: {
          control: 'form-row',
        }
      };
      return new DynamicFormGroupModel(inputSelectGroup, clsGroup);
    } else if (this.configData.selectableMetadata[0].authority) {
      const typeaheadModelConfig: DynamicTypeaheadModelConfig = this.initModel();
      typeaheadModelConfig.search = this.getSearchFn(
        this.getAuthorityOptionsObj(
          this.authorityUuid,
          this.configData.selectableMetadata[0].authority,
          this.configData.selectableMetadata[0].metadata));
      typeaheadModelConfig.value = '';
      typeaheadModelConfig.minChars = 3;
      return new DynamicTypeaheadModel(typeaheadModelConfig);
    } else {
      const inputModelConfig: DynamicInputModelConfig = this.initModel();
      return new DynamicInputModel(inputModelConfig);
    }
  }

  // @TODO To refactor when service for retrieving authority will be available
  protected getAuthority(authorityOptions: AuthorityOptions, pageInfo?: PageInfo): Observable<ConfigData> {
    const queryPage = (hasValue(pageInfo)) ? `&page=${pageInfo.currentPage - 1}&size=${pageInfo.elementsPerPage}` : '';
    const href = `https://dspace7.dev01.4science.it/dspace-spring-rest/api/integration/authorities/${authorityOptions.name}/entries?query=${authorityOptions.query}&metadata=${authorityOptions.metadata}&uuid=${authorityOptions.uuid}${queryPage}`
    return this.formsConfigService.getConfigByHref(href)
      .map((config) => config.payload)
  }

  protected getSearchFn(authorityOptions: AuthorityOptions) {
    return (text: string): Observable<DynamicTypeaheadResponseModel> => {
      authorityOptions.query = text;
      return this.getAuthority(authorityOptions)
        .map((authorities: ConfigData) => {
          // @TODO Pagination for authority is not working, to refactor when it will be fixed
          console.log(authorities);
          return {
            list: authorities.payload,
            pageInfo: authorities.pageInfo
          }
        })
    }
  }
}
