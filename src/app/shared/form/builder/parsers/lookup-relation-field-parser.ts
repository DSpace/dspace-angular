import { FieldParser } from './field-parser';
import {
  DynamicLookupModel,
  DynamicLookupModelConfig
} from '../ds-dynamic-form-ui/models/lookup/dynamic-lookup.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import {
  DynamicLookupRelationModel,
  DynamicLookupRelationModelConfig
} from '../ds-dynamic-form-ui/models/lookup-relation/dynamic-lookup-relation.model';

export class LookupRelationFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {
    const lookupModelConfig: DynamicLookupRelationModelConfig = this.initModel(null, label);
    lookupModelConfig.repeatable = this.configData.repeatable;

    return new DynamicLookupRelationModel(lookupModelConfig);
  }
}
