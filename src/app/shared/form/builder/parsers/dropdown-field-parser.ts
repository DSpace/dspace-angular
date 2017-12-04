import { FieldParser } from './field-parser';
import { ClsConfig, DynamicFormGroupModel, DynamicInputModel, DynamicInputModelConfig } from '@ng-dynamic-forms/core';
import {
  DynamicScrollableDropdownModel,
  DynamicScrollableDropdownModelConfig
} from '../ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { FormFieldModel } from '../models/form-field.model';
import { IntegrationSearchOptions } from '../../../../core/integration/models/integration-options.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { Observable } from 'rxjs/Observable';
import { SubmissionFormsConfigService } from '../../../../core/config/submission-forms-config.service';
import { hasValue, isNotEmpty, isUndefined } from '../../../empty.util';
import { ConfigData } from '../../../../core/config/config-data';
import { GlobalConfig } from '../../../../../config/global-config.interface';
import { RESTURLCombiner } from '../../../../core/url-combiner/rest-url-combiner';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { AuthorityModel } from '../../../../core/integration/models/authority.model';

export class DropdownFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel,
              protected initFormValues,
              protected authorityUuid: string,
              protected formsConfigService: SubmissionFormsConfigService,
              protected EnvConfig: GlobalConfig) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {
    const dropdownModelConfig: DynamicScrollableDropdownModelConfig = this.initModel();
    let cls: ClsConfig;

    if (isNotEmpty(this.configData.selectableMetadata[0].authority)) {
      dropdownModelConfig.authorityMetadata = this.configData.selectableMetadata[0].metadata;
      dropdownModelConfig.authorityName = this.configData.selectableMetadata[0].authority;
      dropdownModelConfig.authorityScope = this.authorityUuid;
      dropdownModelConfig.maxOptions = 10;
      if (isNotEmpty(fieldValue)) {
        const authorityValue = {
          id: fieldValue.authority,
          value: fieldValue.value,
          display: fieldValue.value
        } as AuthorityModel;
        dropdownModelConfig.value = authorityValue;
      }
      cls = {
        element: {
          control: 'col'
        },
        grid: {
          host: 'col'
        }
      };
      const dropdownGroup: DynamicFormGroupModel = Object.create(null);
      dropdownGroup.id = dropdownModelConfig.id + '_group';
      dropdownGroup.group = [new DynamicScrollableDropdownModel(dropdownModelConfig, cls)];
      dropdownGroup.group[0].name = this.fieldId;

      cls = {
        element: {
          control: 'form-row'
        }
      };
      return new DynamicFormGroupModel(dropdownGroup, cls);
    } else {
      throw  Error(`Authority name is not available. Please checks form configuration file.`);
    }
  }

  // @TODO To refactor when service for retrieving authority will be available
  protected getAuthority(authorityOptions: IntegrationSearchOptions, pageInfo?: PageInfo): Observable<ConfigData> {
    const queryPage = (hasValue(pageInfo)) ? `&page=${pageInfo.currentPage - 1}&size=${pageInfo.elementsPerPage}` : '';
    const href = new RESTURLCombiner(this.EnvConfig, `/integration/authorities/${authorityOptions.name}/entries?query=${authorityOptions.query}&metadata=${authorityOptions.metadata}&uuid=${authorityOptions.uuid}${queryPage}`).toString();
    return this.formsConfigService.getConfigByHref(href)
  }
/*
  protected getPagedAuthorityFn(authorityOptions: IntegrationSearchOptions) {
    return (pageInfo: PageInfo): Observable<DynamicScrollableDropdownResponseModel> => {
      return this.getAuthority(authorityOptions, pageInfo)
        .map((authorities: ConfigData) => {
          // @TODO Pagination for authority is not working, to refactor when it will be fixed
          if (isUndefined(pageInfo)) {
            pageInfo = new PageInfo();
            pageInfo.currentPage = 1;
            pageInfo.totalElements = authorities.payload.length;
            pageInfo.elementsPerPage = 10;
            pageInfo.totalPages = Math.ceil(authorities.payload.length / 10);
          }
          const begin = (pageInfo.currentPage === 1) ? 0 : ((pageInfo.elementsPerPage * (pageInfo.currentPage - 1)) + 1);
          const end = pageInfo.elementsPerPage * pageInfo.currentPage;
          const list = authorities.payload.slice(begin, end);
          return {
            list: list,
            pageInfo: pageInfo
          }
        })
    }
  }*/
}
