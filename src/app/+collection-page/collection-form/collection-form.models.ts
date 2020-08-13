import { DynamicFormControlModel, DynamicInputModel, DynamicTextAreaModel } from '@ng-dynamic-forms/core';
import { DynamicSelectModelConfig } from '@ng-dynamic-forms/core/lib/model/select/dynamic-select.model';

export const collectionFormEntityTypeSelectionConfig: DynamicSelectModelConfig<string> = {
  id: 'entityType',
  name: 'relationship.type',
  required: true,
  disabled: false,
  validators: {
    required: null
  },
  errorMessages: {
    required: 'collection.form.errors.entityType.required'
  },
};

export const collectionFormSubmissionDefinitionSelectionConfig: DynamicSelectModelConfig<string> = {
  id: 'submissionDefinition',
  name: 'cris.submission.definition',
  required: true,
  disabled: false,
  validators: {
    required: null
  },
  errorMessages: {
    required: 'collection.form.errors.submissionDefinition.required'
  },
};

/**
 * The dynamic form fields used for creating/editing a collection
 * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
 */
export const collectionFormModels: DynamicFormControlModel[] = [
  new DynamicInputModel({
    id: 'title',
    name: 'dc.title',
    required: true,
    validators: {
      required: null
    },
    errorMessages: {
      required: 'Please enter a name for this title'
    },
  }),
  new DynamicTextAreaModel({
    id: 'description',
    name: 'dc.description',
  }),
  new DynamicTextAreaModel({
    id: 'abstract',
    name: 'dc.description.abstract',
  }),
  new DynamicTextAreaModel({
    id: 'rights',
    name: 'dc.rights',
  }),
  new DynamicTextAreaModel({
    id: 'tableofcontents',
    name: 'dc.description.tableofcontents',
  }),
  new DynamicTextAreaModel({
    id: 'license',
    name: 'dc.rights.license',
  })
]
