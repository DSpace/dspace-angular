import { FieldParser } from './field-parser';
import { ClsConfig, DynamicFormGroupModel } from '@ng-dynamic-forms/core';
import {
  DynamicScrollableDropdownModel,
  DynamicScrollableDropdownModelConfig, DynamicScrollableDropdownResponseModel
} from '../ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { FormFieldModel } from '../models/form-field.model';
import { AuthorityOptions } from '../models/authority-options.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { Observable } from 'rxjs/Observable';
import { SubmissionFormsConfigService } from '../../../../core/config/submission-forms-config.service';
import { hasValue, isUndefined } from '../../../empty.util';
import { ConfigData } from '../../../../core/config/config-data';

export class DropdownFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel,
              protected authorityUuid: string,
              protected formsConfigService: SubmissionFormsConfigService) {
    super(configData);
  }

  public modelFactory(): any {
    const dropdownModelConfig: DynamicScrollableDropdownModelConfig = this.initModel();
    let cls: ClsConfig;

    dropdownModelConfig.retrieve = this.getPagedAuthorityFn(
      this.getAuthorityOptionsObj(
        this.authorityUuid,
        this.configData.selectableMetadata[0].authority,
        this.configData.selectableMetadata[0].metadata)
    );
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
  }

  // @TODO To refactor when service for retrieving authority will be available
  protected getAuthority(authorityOptions: AuthorityOptions, pageInfo?: PageInfo): Observable<ConfigData> {
    const queryPage = (hasValue(pageInfo)) ? `&page=${pageInfo.currentPage - 1}&size=${pageInfo.elementsPerPage}` : '';
    const href = `https://dspace7.dev01.4science.it/dspace-spring-rest/api/integration/authorities/${authorityOptions.name}/entries?query=${authorityOptions.query}&metadata=${authorityOptions.metadata}&uuid=${authorityOptions.uuid}${queryPage}`
    return this.formsConfigService.getConfigByHref(href)
  }

  protected getPagedAuthorityFn(authorityOptions: AuthorityOptions) {
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
  }
}
