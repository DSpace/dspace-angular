import {
  DynamicFormControlModel,
  DynamicInputModel,
  DynamicTextAreaModel,
} from '@ng-dynamic-forms/core';
import { DynamicSelectModelConfig } from '@ng-dynamic-forms/core/lib/model/select/dynamic-select.model';

import { environment } from '../../../environments/environment';

export const collectionFormEntityTypeSelectionConfig: DynamicSelectModelConfig<string> = {
  id: 'entityType',
  name: 'dspace.entity.type',
  disabled: false,
};

/**
 * The dynamic form fields used for an administrator user creating/editing a collection
 * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
 */
export const administratorStyleFormModels: DynamicFormControlModel[] = [
  new DynamicTextAreaModel({
    id: 'css',
    name: 'dspace.collection.css',
    spellCheck: environment.form.spellCheck,
  }),
];

/**
 * The dynamic form fields used for a non-administrator user creating/editing a collection
 * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
 */
export const collectionFormModels: DynamicFormControlModel[] = [
  new DynamicInputModel({
    id: 'title',
    name: 'dc.title',
    required: true,
    validators: {
      required: null,
    },
    errorMessages: {
      required: 'Please enter a name for this title',
    },
  }),
  new DynamicTextAreaModel({
    id: 'description',
    name: 'dc.description',
    spellCheck: environment.form.spellCheck,
  }),
  new DynamicTextAreaModel({
    id: 'abstract',
    name: 'dc.description.abstract',
    spellCheck: environment.form.spellCheck,
  }),
  new DynamicTextAreaModel({
    id: 'rights',
    name: 'dc.rights',
    spellCheck: environment.form.spellCheck,
  }),
  new DynamicTextAreaModel({
    id: 'tableofcontents',
    name: 'dc.description.tableofcontents',
    spellCheck: environment.form.spellCheck,
  }),
  new DynamicTextAreaModel({
    id: 'license',
    name: 'dc.rights.license',
    spellCheck: environment.form.spellCheck,
  }),
];
