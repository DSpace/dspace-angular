import { Injectable } from '@angular/core';
import {
  ClsConfig, DynamicCheckboxModel, DynamicCheckboxModelConfig,
  DynamicDatePickerModel, DynamicDatePickerModelConfig, DynamicEditorModel, DynamicEditorModelConfig,
  DynamicFileUploadModel, DynamicFileUploadModelConfig,
  DynamicFormControlModel,
  DynamicFormGroupModel, DynamicFormGroupModelConfig, DynamicFormService, DynamicInputControlModel,
  DynamicInputControlModelConfig,
  DynamicInputModel, DynamicInputModelConfig,
  DynamicPathable, DynamicRadioGroupModel, DynamicRadioGroupModelConfig, DynamicRatingModel, DynamicRatingModelConfig,
  DynamicSelectModel, DynamicSelectModelConfig, DynamicSliderModel, DynamicSliderModelConfig, DynamicSwitchModel,
  DynamicSwitchModelConfig,
  DynamicTextAreaModel, DynamicTextAreaModelConfig, DynamicTimePickerModel, DynamicTimePickerModelConfig,
  Utils
} from '@ng-dynamic-forms/core';

import AUTHORITY from '../../../backend/data/authority.json';
import { DynamicTypeaheadModel, DynamicTypeaheadModelConfig } from './model/typeahead/dynamic-typeahead.model';
import { Observable } from 'rxjs/Observable';

export const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Injectable()
export class FormService extends DynamicFormService {

  fromConfiguration(json: string | any[]): DynamicFormControlModel[] | never {

    const raw = Utils.isString(json) ? JSON.parse(json as string, Utils.parseJSONReviver) : json;
    const group: DynamicFormControlModel[] = [];
    let cls: ClsConfig;
    raw.fields.forEach((fieldData: any) => {
        // selectableMetadata > 1 può essere attaccato a più campi : onebox, twobox
      switch (fieldData.input.type) {
        case 'date':
          const inputDateModel: DynamicDatePickerModel = Object.create(null);
          this.getCommonProperties<DynamicDatePickerModel>(inputDateModel, fieldData);
          inputDateModel.toggleIcon = 'fa fa-calendar';
          cls = {
            element: {
              container: 'p-0',
              label: 'col-form-label'
            },
            grid: {
              host: 'col-sm-4'
            }
          };
          const datePickerGroup: DynamicFormGroupModel = Object.create(null);
          datePickerGroup.id = inputDateModel.id + '_group';
          datePickerGroup.group = [new DynamicDatePickerModel(inputDateModel, cls)];
          cls = {
            element: {
              control: 'form-row'
            }
          };
          group.push(new DynamicFormGroupModel(datePickerGroup, cls));
          break;

        case 'dropdown':
          // se l'authority ha scrollable true -> select (aggiungere search paginato)
          // select, eccezione se non scrollable
          const dropdownSelectModel: DynamicSelectModelConfig<any> = Object.create(null);
          this.getCommonProperties<DynamicSelectModelConfig<any>>(dropdownSelectModel, fieldData);
          group.push(new DynamicSelectModel(dropdownSelectModel));
          break;
        case 'lookup':
            // se l'authority ha scrollable false search true -> pulsante di ricerca (authority lenta) [num. char = -1]
            break;
        case 'onebox':
          // se l'authority ha scrollable false -> autocomplete [num caratteri minimo > 0]

          if (fieldData.selectableMetadata.length > 1) {
            const newId = fieldData.selectableMetadata[0].metadata
              .split('.')
              .slice(0, fieldData.selectableMetadata[0].metadata.split('.').length - 1)
              .join('.');

            const inputSelectGroup: DynamicFormGroupModelConfig = Object.create(null);
            inputSelectGroup.id = newId.replace(/\./g, '_') + '_group';
            inputSelectGroup.group = [];
            inputSelectGroup.legend = fieldData.label;
            const selectModel: DynamicSelectModelConfig<any> = Object.create(null);
            this.getCommonProperties<DynamicSelectModelConfig<any>>(selectModel, fieldData,  newId + '.metadata');

            cls = {
              element: {
                control: 'input-group-addon ds-form-input-addon',
              },
              grid: {
                host: 'col-sm-4 pr-0'
              }
            };
            inputSelectGroup.group.push(new DynamicSelectModel(selectModel, cls));

            const inputModel: DynamicInputModel = Object.create(null);
            this.getCommonProperties<DynamicInputModel>(inputModel, fieldData, newId + '.value', true, true);
            cls = {
              element: {
                control: 'ds-form-input-value',
              },
              grid: {
                host: 'col-sm-8 pl-0'
              }
            };
            inputSelectGroup.group.push(new DynamicInputModel(inputModel, cls));
            cls = {
              element: {
                control: 'form-row',
              }
            };
            group.push(new DynamicFormGroupModel(inputSelectGroup, cls));
          } else if (fieldData.selectableMetadata[0].authority) {
            /* const selectModelConfig: DynamicSelectModelConfig<any> = Object.create(null);
            this.getCommonProperties(selectModelConfig, fieldData);*/
            const typeaheadModelConfig: DynamicTypeaheadModelConfig = Object.create(null);
            this.getCommonProperties<DynamicTypeaheadModelConfig>(typeaheadModelConfig, fieldData);
            typeaheadModelConfig.search = this.search;
            typeaheadModelConfig.value = '';
            typeaheadModelConfig.minChars = 3;
            group.push(new DynamicTypeaheadModel(typeaheadModelConfig));
          } else {
            const inputModel: DynamicInputModelConfig = Object.create(null);
            this.getCommonProperties<DynamicInputModelConfig>(inputModel, fieldData);
            group.push(new DynamicInputModel(inputModel));
          }
          break;
        case 'list':
          // repeatable -> check box altrimenti radio
          // se non scrollable eccezione
          // verificare numero elementi
          break;
        case 'name':
          // nome cognome -> output: cognome, nome
          break;

        case 'series':
          // due input -> un solo campo di output val1; val2
          break;

        case 'textarea':
          const inputTextModel: DynamicTextAreaModelConfig = Object.create(null);
          this.getCommonProperties<DynamicTextAreaModelConfig>(inputTextModel, fieldData);
          cls = {
            element: {
              label: 'col-form-label'
            }
          };
          group.push(new DynamicTextAreaModel(inputTextModel, cls));
          break;

        case 'twobox':
          // uguale a series senza campi concatenati
          break;

        default:
          throw new Error(`unknown form control model type defined on JSON object with label "${fieldData.label}"`);
      }
    });

    return group;
  }

  protected getCommonProperties<T>(
    inputModel: any,
    configData: any,
    id?: string,
    label = true,
    labelEmpty = false): FormInputModelType {
    // Sets input ID and name
    const inputId = id ? id : configData.selectableMetadata[0].metadata;
    inputModel.id = (inputId).replace(/\./g, '_');
    inputModel.name = inputId;

    // if (typeof inputModel === DynamicSelectModelConfig) {
      // Checks if field has an autorithy and sets options available
    if (configData.selectableMetadata.length === 1 && configData.selectableMetadata[0].authority) {
      inputModel.options = [];
      this.getAuthority().forEach((option, key) => {
        if (key === 0) {
          inputModel.value = (option.id) ? option.id : option.value
        }
        ;
        inputModel.options.push({label: option.display, value: (option.id) ? option.id : option.value})
      });
    }

    // Checks if field has multiple values and sets options available
    if (configData.selectableMetadata.length > 1) {
      inputModel.options = [];
      configData.selectableMetadata.forEach((option, key) => {
        if (key === 0) {
          inputModel.value = option.metadata
        }
        ;
        inputModel.options.push({label: option.label, value: option.metadata})
      });
    }
    // }

    if (label) {
      inputModel.label = (labelEmpty) ? '&nbsp;' : configData.label;
    }

    // if (inputModel instanceof DynamicInputControlModel) {
    inputModel.placeholder = configData.label
    // }

    if (configData.mandatory) {
      inputModel.validators = Object.assign({}, inputModel.validators, {required: null});
      inputModel.errorMessages = Object.assign({}, inputModel.errorMessages, {required: configData.mandatoryMessage})
    }
    if (configData.value) {
      inputModel.value = configData.value;
    }
    return inputModel;
  }

  protected getAuthority(): any[] {
    return AUTHORITY._embedded.authorityEntryResources;
  }

  search = (text: string) =>
    Observable.of(this.getAuthority()
      .filter((item) => item.value.toLowerCase().indexOf(text.toLowerCase()) > -1));

}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type FormInputModelType
  = DynamicInputControlModelConfig<any>
  | DynamicCheckboxModelConfig
  | DynamicDatePickerModelConfig
  | DynamicEditorModelConfig
  | DynamicFileUploadModelConfig
  | DynamicInputModelConfig
  | DynamicRadioGroupModelConfig<any>
  | DynamicRatingModelConfig
  | DynamicSelectModelConfig<any>
  | DynamicSliderModelConfig
  | DynamicSwitchModelConfig
  | DynamicTimePickerModelConfig
