import {FieldParser} from './field-parser';
import {FormFieldModel} from '../models/form-field.model';
import {FormFieldMetadataValueObject} from "../models/form-field-metadata-value.model";
import {ClsConfig, DynamicFormGroupModel, DynamicInputModel, DynamicInputModelConfig} from "@ng-dynamic-forms/core";
import {
  DynamicSeriesAndNameModel, NAME_GROUP_SUFFIX, NAME_INPUT_1_SUFFIX, NAME_INPUT_2_SUFFIX, SERIES_GROUP_SUFFIX,
  SERIES_INPUT_1_SUFFIX,
  SERIES_INPUT_2_SUFFIX
} from "../ds-dynamic-form-ui/models/ds-dynamic-series-name.model";

// @TODO Gestire "name" in questo parser, che concatena con virgola

// TODO Gestire parser (modificare) list, checkbox se il model ha repeteable, sennò radiobutton.
// gestire getEntriesByname come in tag con risultati paginati
// vedere dynamic scrollable,
// integrationsearchoption è il modello con le pagine. Io deve richiedere a partire da 1, il server risponde da 0.
// L'ultima dimensione restituita di size è sbagliata
// fare ListModel
export class SeriesAndNameFieldParser extends FieldParser {
  private groupSuffix;
  private input1suffix;
  private input2suffix;

  constructor(protected configData: FormFieldModel, protected initFormValues, private type: string) {
    super(configData, initFormValues);

    if(type === 'series') {
      this.groupSuffix = SERIES_GROUP_SUFFIX;
      this.input1suffix = SERIES_INPUT_1_SUFFIX;
      this.input2suffix = SERIES_INPUT_2_SUFFIX;
    } else {
      // Name
      this.groupSuffix = NAME_GROUP_SUFFIX;
      this.input1suffix = NAME_INPUT_1_SUFFIX;
      this.input2suffix = NAME_INPUT_2_SUFFIX;
    }
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {

    let clsGroup: ClsConfig;
    let clsInput: ClsConfig;
    const newId = this.configData.selectableMetadata[0].metadata
      .split('.')
      .slice(0, this.configData.selectableMetadata[0].metadata.split('.').length - 1)
      .join('.');

    clsInput = {
      grid: {
        host: 'col-sm-6'
      }
    };

    const inputGroup: DynamicFormGroupModel = Object.create(null);
    inputGroup.id = newId.replace(/\./g, '_') + this.groupSuffix;
    inputGroup.group = [];

    const input1ModelConfig: DynamicInputModelConfig = this.initModel(newId + this.input1suffix, true, false);
    const input2ModelConfig: DynamicInputModelConfig = this.initModel(newId + this.input2suffix, true, true);

    // values
    if (fieldValue && fieldValue.value && fieldValue.value.length > 0) {
      const values = fieldValue.value.split(';');

      if (values.length > 1) {
        input1ModelConfig.value = values[0];
        input1ModelConfig.value = values[1];
      }
    }


    let model1 = new DynamicInputModel(input1ModelConfig, clsInput);
    let model2 = new DynamicInputModel(input2ModelConfig, clsInput);
    model1.name = this.getFieldId()[0];
    model2.name = this.getFieldId()[0];
    inputGroup.group.push(model1);
    inputGroup.group.push(model2);

    clsGroup = {
      element: {
        control: 'form-row',
      }
    };
    return new DynamicSeriesAndNameModel(inputGroup, clsGroup);
  }

}
