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
import { DynamicListModel, DynamicListModelConfig } from '../ds-dynamic-form-ui/models/list/dynamic-list.model';

export class ListFieldParser extends FieldParser {
  searchOptions: IntegrationSearchOptions;

  constructor(protected configData: FormFieldModel,
              protected initFormValues,
              protected authorityUuid: string,
              private authorityService: AuthorityService) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {
    let listModelConfig: DynamicListModelConfig = this.initModel();
    listModelConfig.repeatable = this.configData.repeatable;
    // listModelConfig.repeatable = false; // TODO REMOVE, FORCE RADIO

    if(this.configData.selectableMetadata[0].authority
      && this.configData.selectableMetadata[0].authority.length > 0 ) {

      if (isNotEmpty(fieldValue)) {
        const authorityValue = {
          id: fieldValue.authority,
          value: fieldValue.value,
          display: fieldValue.value
        } as AuthorityModel;
        listModelConfig.value = authorityValue;
      }
    }

    let listModel = new DynamicListModel(listModelConfig);
    listModel.name = this.getFieldId()[0];
    listModel.authorityMetadata = this.configData.selectableMetadata[0].metadata;
    listModel.authorityName = this.configData.selectableMetadata[0].authority;
    listModel.authorityScope = this.authorityUuid;

    this.searchOptions = new IntegrationSearchOptions(
      listModel.authorityScope,
      listModel.authorityName,
      listModel.authorityMetadata);

    return listModel;
  }



}
