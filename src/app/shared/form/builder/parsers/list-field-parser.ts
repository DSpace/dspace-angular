import { FieldParser } from './field-parser';
import {
  ClsConfig,
  DynamicCheckboxGroupModel,
  DynamicCheckboxModel, DynamicCheckboxModelConfig, DynamicFormGroupModel, DynamicFormGroupModelConfig,
  DynamicRadioGroupModel, DynamicRadioGroupModelConfig
} from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';
import { SubmissionFormsConfigService } from '../../../../core/config/submission-forms-config.service';
import { hasValue, isNotUndefined } from '../../../empty.util';
import { AuthorityOptions } from '../models/authority-options.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { RESTURLCombiner } from '../../../../core/url-combiner/rest-url-combiner';
import { GlobalConfig } from '../../../../../config/global-config.interface';
import { Observable } from 'rxjs/Observable';
import { ConfigData } from '../../../../core/config/config-data';
import { ConfigAuthorityModel } from '../../../../core/shared/config/config-authority.model';

const AUTHORITY = [ {
  id : 'H2020',
  display : 'This publication is published in the framework of a Horizon 2020 project.',
  value : 'H2020',
  otherInformation : { },
  type : 'authority'
}, {
  id : 'VSC',
  display : 'The computational resources and services used in this work were provided by the <a href=\"https://www.vscentrum.be\">VSC</a>.',
  value : 'VSC',
  otherInformation : { },
  type : 'authority'
} ];

export class ListFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel,
              protected authorityUuid: string,
              protected formsConfigService: SubmissionFormsConfigService,
              protected EnvConfig: GlobalConfig) {
    super(configData);
  }

  public modelFactory(): any {
    let listModelConfig: DynamicFormGroupModelConfig | DynamicRadioGroupModelConfig<any>;
    let listModel;
    listModelConfig = this.initModel();
    if (this.configData.repeatable ) {
      listModel = new DynamicCheckboxGroupModel(listModelConfig);
    } else {
      listModel = new DynamicRadioGroupModel(listModelConfig);
    }
    this.setOptionsFromAuthority(listModel, this.configData.repeatable);
    listModel.name = this.fieldId
    return listModel;
  }

  protected setOptionsFromAuthority(controlModel: DynamicFormGroupModel | DynamicRadioGroupModel<any>,
                                    repeatable: boolean) {
    if (isNotUndefined(this.configData.selectableMetadata)
      && isNotUndefined(this.configData.selectableMetadata[0].metadata)
      && isNotUndefined(this.configData.selectableMetadata[0].authority)) {

      return this.getAuthority(this.getAuthorityOptionsObj(
        this.authorityUuid,
        this.configData.selectableMetadata[0].authority,
        this.configData.selectableMetadata[0].metadata))
        .subscribe((authorities: ConfigData) => {
          const list = [];
          (authorities.payload as ConfigAuthorityModel[]).forEach((option, key) => {
            if (repeatable) {
              list.push(new DynamicCheckboxModel({label: option.display, id: option.value, value: false}))
            } else {
              list.push(new DynamicRadioGroupModel({label: option.display, value: option.value}))
            }
          });
          if (repeatable) {
            (controlModel as DynamicFormGroupModelConfig).group = list;
          } else {
            (controlModel as DynamicRadioGroupModelConfig<any>).options = list;
          }
        })
    }
  }

  // @TODO To refactor when service for retrieving authority will be available
  protected getAuthority(authorityOptions: AuthorityOptions, pageInfo?: PageInfo): Observable<any> {
    /*const queryPage = (hasValue(pageInfo)) ? `&page=${pageInfo.currentPage - 1}&size=${pageInfo.elementsPerPage}` : '';
    const href = new RESTURLCombiner(this.EnvConfig, `/integration/authorities/${authorityOptions.name}/entries?query=${authorityOptions.query}&metadata=${authorityOptions.metadata}&uuid=${authorityOptions.uuid}${queryPage}`).toString();
    // const href = `https://dspace7.dev01.4science.it/dspace-spring-rest/api/integration/authorities/${authorityOptions.name}/entries?query=${authorityOptions.query}&metadata=${authorityOptions.metadata}&uuid=${authorityOptions.uuid}${queryPage}`
    return this.formsConfigService.getConfigByHref(href)*/
    return Observable.of({payload:AUTHORITY})

  }
}
