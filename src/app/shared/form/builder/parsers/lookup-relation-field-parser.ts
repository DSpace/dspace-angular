import { FieldParser } from './field-parser';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { DynamicLookupRelationModel, DynamicLookupRelationModelConfig } from '../ds-dynamic-form-ui/models/lookup-relation/dynamic-lookup-relation.model';

export class LookupRelationFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {
    const lookupModelConfig: DynamicLookupRelationModelConfig = this.initModel(null, label);
    lookupModelConfig.repeatable = this.configData.repeatable;
    /* TODO what to do with multiple relationships? */
    lookupModelConfig.relationship = this.configData.selectableRelationships[0];
    return new DynamicLookupRelationModel(lookupModelConfig);
  }
}
