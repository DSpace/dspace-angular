import {
  DynamicFormControlModel,
  DynamicInputModel,
  DynamicTextAreaModel,
} from '@ng-dynamic-forms/core';

import { environment } from '../../../environments/environment';


/**
 * The dynamic form fields used for creating/editing a community
 * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
 */
export const communityFormModels = (lang: string, isDefaultLanguage: boolean): DynamicFormControlModel[] => {
  return  [
    new DynamicInputModel({
      id: `title-${lang}`,
      name: 'dc.title',
      required: isDefaultLanguage,
      validators: {
        required: null,
      },
      errorMessages: {
        required: 'Please enter a name for this title',
      },
    }),
    new DynamicTextAreaModel({
      id: `description-${lang}`,
      name: 'dc.description',
      spellCheck: environment.form.spellCheck,
    }),
    new DynamicTextAreaModel({
      id: `abstract-${lang}`,
      name: 'dc.description.abstract',
      spellCheck: environment.form.spellCheck,
    }),
    new DynamicTextAreaModel({
      id: `rights-${lang}`,
      name: 'dc.rights',
      spellCheck: environment.form.spellCheck,
    }),
    new DynamicTextAreaModel({
      id: `tableofcontents-${lang}`,
      name: 'dc.description.tableofcontents',
      spellCheck: environment.form.spellCheck,
    }),
  ];
};
