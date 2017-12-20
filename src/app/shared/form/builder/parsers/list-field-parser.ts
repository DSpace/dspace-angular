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
import { IntegrationSearchOptions } from '../../../../core/integration/models/integration-options.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { RESTURLCombiner } from '../../../../core/url-combiner/rest-url-combiner';
import { GlobalConfig } from '../../../../../config/global-config.interface';
import { Observable } from 'rxjs/Observable';
import { ConfigData } from '../../../../core/config/config-data';
import { ConfigAuthorityModel } from '../../../../core/shared/config/config-authority.model';
import {AuthorityService} from "../../../../core/integration/authority.service";
import {FormFieldMetadataValueObject} from "../models/form-field-metadata-value.model";
import {isNotEmpty} from '../../../empty.util';
import { AuthorityModel } from '../../../../core/integration/models/authority.model';


// const AUTHORITY = [ {
//   id : 'H2020',
//   display : 'This publication is published in the framework of a Horizon 2020 project.',
//   value : 'H2020',
//   otherInformation : { },
//   type : 'authority'
// }, {
//   id : 'VSC',
//   display : 'The computational resources and services used in this work were provided by the <a href=\"https://www.vscentrum.be\">VSC</a>.',
//   value : 'VSC',
//   otherInformation : { },
//   type : 'authority'
// } ];

export class ListFieldParser extends FieldParser {
  searchOptions: IntegrationSearchOptions;

  constructor(protected configData: FormFieldModel,
              protected initFormValues,
              protected authorityUuid: string,
              private authorityService: AuthorityService) {
    super(configData, initFormValues);

  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {
    let listModelConfig: DynamicFormGroupModelConfig | DynamicRadioGroupModelConfig<any>;
    let listModel;
    listModelConfig = this.initModel();
    if (this.configData.repeatable ) {
      listModel = new DynamicCheckboxGroupModel(listModelConfig);
    } else {
      listModel = new DynamicRadioGroupModel(listModelConfig);
    }
    listModel.name = this.getFieldId()[0];

    if(this.configData.selectableMetadata[0].authority
      && this.configData.selectableMetadata[0].authority.length > 0 ) {
      listModel.authorityMetadata = this.configData.selectableMetadata[0].metadata;
      listModel.authorityName = this.configData.selectableMetadata[0].authority;
      listModel.authorityScope = this.authorityUuid;
      if (isNotEmpty(fieldValue)) {
        const authorityValue = {
          id: fieldValue.authority,
          value: fieldValue.value,
          display: fieldValue.value
        } as AuthorityModel;
        listModel.value = authorityValue;
      }
    }

    this.searchOptions = new IntegrationSearchOptions(
      listModel.authorityScope,
      listModel.authorityName,
      listModel.authorityMetadata);

    this.setOptionsFromAuthority(listModel, this.configData.repeatable);
    return listModel;
  }

  protected setOptionsFromAuthority(controlModel: DynamicFormGroupModel | DynamicRadioGroupModel<any>,
                                    repeatable: boolean) {
    if (isNotUndefined(this.configData.selectableMetadata)
      && isNotUndefined(this.configData.selectableMetadata[0].metadata)
      && isNotUndefined(this.configData.selectableMetadata[0].authority)) {

      this.authorityService.getEntriesByName(this.searchOptions).subscribe((authorities: ConfigData) => {
          let list = this.pushAuthorities(authorities, repeatable);
        const totalPages =  authorities.pageInfo.totalPages;
        let currentPage = authorities.pageInfo.currentPage;
        while ( currentPage < totalPages) {
          // TODO Gestire parser (modificare) list, checkbox se il model ha repeteable, sennò radiobutton.
          // gestire getEntriesByname come in tag con risultati paginati
          // vedere dynamic scrollable,
          // integrationsearchoption è il modello con le pagine. Io deve richiedere a partire da 1, il server risponde da 0.
          // L'ultima dimensione restituita di size è sbagliata
          // fare ListModel
          this.searchOptions.currentPage = currentPage+2;
          // this.authorityService.getEntriesByName(this.searchOptions).
          //
          //
          // currentPage
        }


        if (repeatable) {
          (controlModel as DynamicFormGroupModelConfig).group = list;
        } else {
          (controlModel as DynamicRadioGroupModelConfig<any>).options = list;
        }
      });

    }
  }

  pushAuthorities(authorities: ConfigData, repeatable: boolean): any[] {
    const list = [];
    (authorities.payload as ConfigAuthorityModel[]).forEach((option, key) => {
      if (repeatable) {
        list.push(new DynamicCheckboxModel({label: option.display, id: option.value, value: false}))
      } else {
        list.push(new DynamicRadioGroupModel({label: option.display, value: option.value}))
      }
    });

    return list;
  }

  // @TODO To refactor when service for retrieving authority will be available
  // protected getAuthority(authorityOptions: IntegrationSearchOptions, pageInfo?: PageInfo): Observable<any> {
  // protected getAuthority(pageInfo?: PageInfo): Observable<any> {
  //   /*const queryPage = (hasValue(pageInfo)) ? `&page=${pageInfo.currentPage - 1}&size=${pageInfo.elementsPerPage}` : '';
  //   const href = new RESTURLCombiner(this.EnvConfig, `/integration/authorities/${authorityOptions.name}/entries?query=${authorityOptions.query}&metadata=${authorityOptions.metadata}&uuid=${authorityOptions.uuid}${queryPage}`).toString();
  //   // const href = `https://dspace7.dev01.4science.it/dspace-spring-rest/api/integration/authorities/${authorityOptions.name}/entries?query=${authorityOptions.query}&metadata=${authorityOptions.metadata}&uuid=${authorityOptions.uuid}${queryPage}`
  //   return this.formsConfigService.getConfigByHref(href)*/
  //   // return Observable.of({payload:AUTHORITY})
  //
  //   return this.authorityService.getEntriesByName(this.searchOptions)
  //     .map((authorities) => {
  //       // @TODO Pagination for authority is not working, to refactor when it will be fixed
  //       return {
  //         list: authorities.payload,
  //         pageInfo: authorities.pageInfo
  //       }
  //     });
  // }
}
