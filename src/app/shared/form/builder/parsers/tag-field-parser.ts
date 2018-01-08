import {FieldParser} from './field-parser';
import {FormFieldModel} from '../models/form-field.model';
import {FormFieldMetadataValueObject} from '../models/form-field-metadata-value.model';
import {isNotEmpty} from '../../../empty.util';
import {AuthorityModel} from "../../../../core/integration/models/authority.model";
import {DynamicTagModel, DynamicTagModelConfig} from "../ds-dynamic-form-ui/models/tag/dynamic-tag.model";
import {Observable} from 'rxjs/Observable';
import {SearchOptions} from '../../../../+search-page/search-options.model';
import {IntegrationSearchOptions} from '../../../../core/integration/models/integration-options.model';
import {AuthorityService} from '../../../../core/integration/authority.service';

export class TagFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues,
              protected authorityUuid: string) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {
    const tagModelConfig: DynamicTagModelConfig = this.initModel();
    if (this.configData.selectableMetadata[0].authority
      && this.configData.selectableMetadata[0].authority.length > 0 ) {
        tagModelConfig.authorityMetadata = this.configData.selectableMetadata[0].metadata;
        tagModelConfig.authorityName = this.configData.selectableMetadata[0].authority;
        tagModelConfig.authorityScope = this.authorityUuid;
        if (isNotEmpty(fieldValue)) {
          const authorityValue = {
            id: fieldValue.authority,
            value: fieldValue.value,
            display: fieldValue.value
          } as AuthorityModel;
          tagModelConfig.value = authorityValue;
        }

    }

    if (isNotEmpty(this.getInitGroupValues())) {
      tagModelConfig.storedValue = this.getInitGroupValues();
    }

    tagModelConfig.minChars = 3;
    const tagModel = new DynamicTagModel(tagModelConfig);
    tagModel.name = this.fieldId;

    console.log('initgroupValue');
    console.log(this.getInitGroupValues());

    return tagModel;
  }

}
