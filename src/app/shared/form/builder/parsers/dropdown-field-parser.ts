import { CONFIG_SERVICE, FieldParser } from './field-parser';
import { ClsConfig, DynamicFormGroupModel } from '@ng-dynamic-forms/core';
import {
  DynamicScrollableDropdownModel,
  DynamicScrollableDropdownModelConfig, DynamicScrollableDropdownResponseModel
} from '../ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { FormFieldModel } from '../models/form-field.model';
import { AuthorityOptions } from '../models/authority-options.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { Observable } from 'rxjs/Observable';
import { ConfigObject } from '../../../../core/shared/config/config.model';
import { Inject, Injector, ReflectiveInjector } from '@angular/core';
import { SubmissionFormsConfigService } from '../../../../core/config/submission-forms-config.service';
import { hasValue, isUndefined } from '../../../empty.util';
import { ResponseCacheService } from '../../../../core/cache/response-cache.service';
import { RequestService } from '../../../../core/data/request.service';

export class DropdownFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel,
              protected authorityOptions: AuthorityOptions,
              protected formsConfigService: SubmissionFormsConfigService) {
    super(configData);
  }

  public parse(): any {
    const dropdownModelConfig: DynamicScrollableDropdownModelConfig = this.initModel();
    let cls: ClsConfig;

    this.authorityOptions.name = this.configData.selectableMetadata[0].authority;
    this.authorityOptions.metadata = this.configData.selectableMetadata[0].metadata;
    dropdownModelConfig.retrieve = this.getPagedAuthority;
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
    cls = {
      element: {
        control: 'form-row'
      }
    };
    return new DynamicFormGroupModel(dropdownGroup, cls);
  }

  protected getAuthority(authorityOptions: AuthorityOptions, pageInfo?: PageInfo): Observable<any[]> {
    const queryPage = (hasValue(pageInfo)) ? `&page=${pageInfo.currentPage - 1}&size=${pageInfo.elementsPerPage}` : '';
    const href = `https://dspace7.dev01.4science.it/dspace-spring-rest/api/integration/authorities/${authorityOptions.name}/entries?query=${authorityOptions.query}&metadata=${authorityOptions.metadata}&uuid=${authorityOptions.uuid}${queryPage}`
    return this.formsConfigService.getConfigByHref(href)
  }

  getPagedAuthority = (pageInfo: PageInfo): Observable<DynamicScrollableDropdownResponseModel> => {
    return this.getAuthority(this.authorityOptions, pageInfo)
      .map((authorities: any) => {
        if (isUndefined(pageInfo)) {
          pageInfo = new PageInfo();
          pageInfo.currentPage = 1;
          pageInfo.totalElements = authorities.length;
          pageInfo.elementsPerPage = 10;
          pageInfo.totalPages = Math.ceil(authorities.length / 10);
          authorities = authorities.slice(0,10);
        }
        return {
          list: authorities,
          pageInfo: pageInfo
        }
      })
    /*if (isUndefined(pageInfo)) {
      pageInfo = new PageInfo();
      pageInfo.currentPage = 1;
      pageInfo.totalElements = 50;
      pageInfo.elementsPerPage = 10;
      pageInfo.totalPages = 5;
    }
    const begin = (pageInfo.currentPage === 1) ? 0 : ((pageInfo.elementsPerPage * (pageInfo.currentPage - 1)) + 1);
    const end = pageInfo.elementsPerPage * pageInfo.currentPage;
    return Observable.of({
      list: AUTHORITY._embedded.authorityEntryResources.slice(begin, end),
      pageInfo: pageInfo
    }).delay(2000);*/
  }
}
