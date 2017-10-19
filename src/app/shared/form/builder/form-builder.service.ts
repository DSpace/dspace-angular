import { Injectable } from '@angular/core';
import {
  ClsConfig, DynamicCheckboxModel, DynamicCheckboxModelConfig, DynamicCheckControlModel,
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

import AUTHORITY from '../../../../backend/data/authority.json';
import { DynamicTypeaheadModel, DynamicTypeaheadModelConfig } from './model/typeahead/dynamic-typeahead.model';
import { Observable } from 'rxjs/Observable';
import {
  DynamicScrollableDropdownModel,
  DynamicScrollableDropdownModelConfig
} from './model/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { isUndefined } from '../../empty.util';

export const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Injectable()
export class FormBuilderService extends DynamicFormService {

  modelFromConfiguration(json: string | any[]): DynamicFormControlModel[] | never {

    const raw = Utils.isString(json) ? JSON.parse(json as string, Utils.parseJSONReviver) : json;
    const group: DynamicFormControlModel[] = [];
    let fields: any = [];
    let cls: ClsConfig;

    raw.pages.forEach((page: any) => {
      fields = fields.concat(page.fields);
    });
    fields.forEach((fieldData: any) => {
        // selectableMetadata > 1 può essere attaccato a più campi : onebox, twobox
      switch (fieldData.input.type) {
        case 'date':
          const inputDateModelConfig: DynamicDatePickerModelConfig = this.getModelConfig(fieldData);

          inputDateModelConfig.toggleIcon = 'fa fa-calendar';
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
          datePickerGroup.id = inputDateModelConfig.id + '_group';
          datePickerGroup.group = [new DynamicDatePickerModel(inputDateModelConfig, cls)];
          cls = {
            element: {
              control: 'form-row'
            }
          };
          group.push(new DynamicFormGroupModel(datePickerGroup, cls));
          break;

        case 'dropdown':
          // se l'authority ha scrollable true -> select (aggiungere retrieveOptions paginato)
          // select, eccezione se non scrollable
          const dropdownModelConfig: DynamicScrollableDropdownModelConfig = this.getModelConfig(fieldData);
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
          group.push(new DynamicFormGroupModel(dropdownGroup, cls));
          break;
        case 'lookup':
            // se l'authority ha scrollable false retrieveOptions true -> pulsante di ricerca (authority lenta) [num. char = -1]
            break;
        case 'onebox':
          // se l'authority ha scrollable false -> autocomplete [num caratteri minimo > 0]

          if (fieldData.selectableMetadata.length > 1) {
            const newId = fieldData.selectableMetadata[0].metadata
              .split('.')
              .slice(0, fieldData.selectableMetadata[0].metadata.split('.').length - 1)
              .join('.');

            const inputSelectGroup: DynamicFormGroupModel = Object.create(null);
            inputSelectGroup.id = newId.replace(/\./g, '_') + '_group';
            inputSelectGroup.group = [];
            inputSelectGroup.legend = fieldData.label;

            const selectModelConfig: DynamicSelectModelConfig<any> = this.getModelConfig(fieldData,  newId + '.metadata');
            cls = {
              element: {
                control: 'input-group-addon ds-form-input-addon',
              },
              grid: {
                host: 'col-sm-4 pr-0'
              }
            };
            inputSelectGroup.group.push(new DynamicSelectModel(selectModelConfig, cls));

            fieldData.selectableMetadata = [];
            const inputModelConfig: DynamicInputModelConfig = this.getModelConfig(fieldData, newId + '.value', true, true);;
            cls = {
              element: {
                control: 'ds-form-input-value',
              },
              grid: {
                host: 'col-sm-8 pl-0'
              }
            };

            inputSelectGroup.group.push(new DynamicInputModel(inputModelConfig, cls));
            cls = {
              element: {
                control: 'form-row',
              }
            };
            group.push(new DynamicFormGroupModel(inputSelectGroup, cls));
          } else if (fieldData.selectableMetadata[0].authority) {
            /* const selectModelConfig: DynamicSelectModelConfig<any> = Object.create(null);
            this.getModelConfig(selectModelConfig, fieldData);*/
            const typeaheadModelConfig: DynamicTypeaheadModelConfig = this.getModelConfig(fieldData);
            typeaheadModelConfig.search = this.search;
            typeaheadModelConfig.value = '';
            typeaheadModelConfig.minChars = 3;
            group.push(new DynamicTypeaheadModel(typeaheadModelConfig));
          } else {
            const inputModelConfig: DynamicInputModelConfig = this.getModelConfig(fieldData);
            group.push(new DynamicInputModel(inputModelConfig));
          }
          break;
        case 'list':
          if (fieldData.repeatable ) {
            const checkboxModelConfig: DynamicCheckboxModelConfig = this.getModelConfig(fieldData);
            group.push(new DynamicCheckboxModel(checkboxModelConfig));
            // repeatable -> check box altrimenti radio
          } else {
            const radioModelConfig: DynamicRadioGroupModelConfig<any> = this.getModelConfig(fieldData);
            group.push(new DynamicRadioGroupModel(radioModelConfig));
          }
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
          const inputTextModel: DynamicTextAreaModelConfig = this.getModelConfig(fieldData);
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

  protected getModelConfig(
    configData: any,
    id?: string,
    label = true,
    labelEmpty = false) {

    const controlModel = Object.create(null);

    // Sets input ID and name
    const inputId = id ? id : configData.selectableMetadata[0].metadata;
    controlModel.id = (inputId).replace(/\./g, '_');
    controlModel.name = inputId;

    // Checks if field has an autorithy and sets options available
    if (configData.input.type !== 'dropdown' && configData.selectableMetadata.length === 1 && configData.selectableMetadata[0].authority) {
      controlModel.options = [];
      this.getAuthority().forEach((option, key) => {
        if (key === 0) {
          controlModel.value = (option.id) ? option.id : option.value
        }
        controlModel.options.push({label: option.display, value: (option.id) ? option.id : option.value})
      });
    }

    // Checks if field has multiple values and sets options available
    if (configData.selectableMetadata.length > 1) {
      controlModel.options = [];
      configData.selectableMetadata.forEach((option, key) => {
        if (key === 0) {
          controlModel.value = option.metadata
        }
        controlModel.options.push({label: option.label, value: option.metadata})
      });
    }
    // }

    if (label) {
      controlModel.label = (labelEmpty) ? '&nbsp;' : configData.label;
    }

    // if (inputModel instanceof DynamicInputControlModel) {
    controlModel.placeholder = configData.label
    // }

    if (configData.mandatory) {
      controlModel.required = true;
      controlModel.validators = Object.assign({}, controlModel.validators, {required: null});
      controlModel.errorMessages = Object.assign({}, controlModel.errorMessages, {required: configData.mandatoryMessage})
    }
    if (configData.value) {
      controlModel.value = configData.value;
    }

    return controlModel;
  }

  protected getAuthority(): any[] {
    return AUTHORITY._embedded.authorityEntryResources;
  }

  protected getPagedAuthority(pageInfo: PageInfo): Observable<any> {
    if (isUndefined(pageInfo)) {
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
    }).delay(2000);
  }

  search = (text: string) =>
    Observable.of(this.getAuthority()
      .filter((item) => item.value.toLowerCase().indexOf(text.toLowerCase()) > -1)).delay(2000);

}
