import { DsDynamicInputModel } from '../form/builder/ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { DynamicQualdropModel } from '../form/builder/ds-dynamic-form-ui/models/ds-dynamic-qualdrop.model';
import {
  DynamicRowArrayModel,
  DynamicRowArrayModelConfig
} from '../form/builder/ds-dynamic-form-ui/models/ds-dynamic-row-array-model';
import { DynamicSelectModel } from '@ng-dynamic-forms/core';
import { FormRowModel } from '../../core/config/models/config-submission-forms.model';
import { SubmissionScopeType } from '../../core/submission/submission-scope-type';
import { DynamicRelationGroupModel } from '../form/builder/ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
import { FormFieldModel } from '../form/builder/models/form-field.model';
import { AuthorityOptions } from '../../core/integration/models/authority-options.model';
import { AuthorityValue } from '../../core/integration/models/authority.value';
import { FormFieldMetadataValueObject } from '../form/builder/models/form-field-metadata-value.model';
import { DynamicRowGroupModel } from '../form/builder/ds-dynamic-form-ui/models/ds-dynamic-row-group-model';

export const qualdropSelectConfig = {
  name: 'dc.identifier_QUALDROP_METADATA',
  id: 'dc_identifier_QUALDROP_METADATA',
  readOnly: false,
  disabled: false,
  label: 'Identifiers',
  placeholder: 'Identifiers',
  options: [
    {
      label: 'ISSN',
      value: 'dc.identifier.issn'
    },
    {
      label: 'Other',
      value: 'dc.identifier.other'
    },
    {
      label: 'ISMN',
      value: 'dc.identifier.ismn'
    },
    {
      label: 'Gov\'t Doc #',
      value: 'dc.identifier.govdoc'
    },
    {
      label: 'URI',
      value: 'dc.identifier.uri'
    },
    {
      label: 'ISBN',
      value: 'dc.identifier.isbn'
    }
  ],
  value: 'dc.identifier.issn'
};

export const qualdropInputConfig = {
  name: 'dc.identifier_QUALDROP_VALUE',
  id: 'dc_identifier_QUALDROP_VALUE',
  readOnly: false,
  disabled: false,
  value: 'test'
};

export const mockQualdropSelectModel = new DynamicSelectModel(qualdropSelectConfig);
export const mockQualdropInputModel = new DsDynamicInputModel(qualdropInputConfig);

export const qualdropConfig = {
  id: 'dc_identifier_QUALDROP_GROUP',
  legend: 'Identifiers',
  readOnly: false,
  group: [mockQualdropSelectModel, mockQualdropInputModel]
};

export const MockQualdropModel = new DynamicQualdropModel(qualdropConfig);

const rowArrayQualdropConfig = {
  id: 'row_QUALDROP_GROUP',
  initialCount: 1,
  notRepeatable: true,
  groupFactory: () => {
    return [MockQualdropModel];
  }
} as DynamicRowArrayModelConfig;

export const MockRowArrayQualdropModel: DynamicRowArrayModel = new DynamicRowArrayModel(rowArrayQualdropConfig);

const mockFormRowModel = {
  fields: [
    {
      input: {type: 'lookup'},
      label: 'Journal',
      mandatory: 'false',
      repeatable: false,
      hints: 'Enter the name of the journal where the item has been\n\t\t\t\t\tpublished, if any.',
      selectableMetadata: [
        {
          metadata: 'journal',
          authority: 'JOURNALAuthority',
          closed: false
        }
      ],
      languageCodes: []
    } as FormFieldModel,
    {
      input: {type: 'onebox'},
      label: 'Issue',
      mandatory: 'false',
      repeatable: false,
      hints: ' Enter issue number.',
      selectableMetadata: [
        {
          metadata: 'issue'
        }
      ],
      languageCodes: []
    } as FormFieldModel
  ]
} as FormRowModel;

const relationGroupConfig = {
  id: 'relationGroup',
  formConfiguration: [mockFormRowModel],
  mandatoryField: 'false',
  relationFields: ['journal', 'issue'],
  scopeUUID: 'scope',
  submissionScope: SubmissionScopeType.WorkspaceItem,
  value: {
    journal: [
      'journal test 1',
      'journal test 2'
    ],
    issue: [
      'issue test 1',
      'issue test 2'
    ],
  }
};

export const MockRelationModel: DynamicRelationGroupModel = new DynamicRelationGroupModel(relationGroupConfig);

export const inputWithLanguageAndAuthorityConfig = {
  authorityOptions: new AuthorityOptions('testAuthority', 'testWithAuthority', 'scope'),
  languageCodes: [
    {
      display: 'English',
      code: 'en_US'
    },
    {
      display: 'Italian',
      code: 'it_IT'
    }
  ],
  language: 'en_US',
  name: 'testWithAuthority',
  id: 'testWithAuthority',
  readOnly: false,
  disabled: false,
  value:  {
    value: 'testWithLanguageAndAuthority',
    display: 'testWithLanguageAndAuthority',
    id: 'testWithLanguageAndAuthority',
  }
};

export const mockInputWithLanguageAndAuthorityModel = new DsDynamicInputModel(inputWithLanguageAndAuthorityConfig);

export const inputWithLanguageConfig = {
  languageCodes: [
    {
      display: 'English',
      code: 'en_US'
    },
    {
      display: 'Italian',
      code: 'it_IT'
    }
  ],
  language: 'en_US',
  name: 'testWithLanguage',
  id: 'testWithLanguage',
  readOnly: false,
  disabled: false,
  value: 'testWithLanguage'
};

export const mockInputWithLanguageModel = new DsDynamicInputModel(inputWithLanguageConfig);

export const inputWithLanguageAndAuthorityArrayConfig = {
  authorityOptions: new AuthorityOptions('testAuthority', 'testWithAuthority', 'scope'),
  languageCodes: [
    {
      display: 'English',
      code: 'en_US'
    },
    {
      display: 'Italian',
      code: 'it_IT'
    }
  ],
  language: 'en_US',
  name: 'testWithLanguageAndAuthorityArray',
  id: 'testWithLanguageAndAuthorityArray',
  readOnly: false,
  disabled: false,
  value: [{
    value: 'testLanguageAndAuthorityArray',
    display: 'testLanguageAndAuthorityArray',
    id: 'testLanguageAndAuthorityArray',
  }]
};

export const mockInputWithLanguageAndAuthorityArrayModel = new DsDynamicInputModel(inputWithLanguageAndAuthorityArrayConfig);

export const inputWithFormFieldValueConfig = {
  name: 'testWithFormField',
  id: 'testWithFormField',
  readOnly: false,
  disabled: false,
  value: new FormFieldMetadataValueObject('testWithFormFieldValue')
};

export const mockInputWithFormFieldValueModel = new DsDynamicInputModel(inputWithFormFieldValueConfig);

export const inputWithAuthorityValueConfig = {
  name: 'testWithAuthorityField',
  id: 'testWithAuthorityField',
  readOnly: false,
  disabled: false,
  value: Object.assign({}, new AuthorityValue(), { value: 'testWithAuthorityValue', id: 'testWithAuthorityValue', display: 'testWithAuthorityValue' })
};

export const mockInputWithAuthorityValueModel = new DsDynamicInputModel(inputWithAuthorityValueConfig);

export const inputWithObjectValueConfig = {
  name: 'testWithObjectValue',
  id: 'testWithObjectValue',
  readOnly: false,
  disabled: false,
  value: { value: 'testWithObjectValue', id: 'testWithObjectValue', display: 'testWithObjectValue' }
};

export const mockInputWithObjectValueModel = new DsDynamicInputModel(inputWithObjectValueConfig);

export const mockRowGroupModel = new DynamicRowGroupModel({
  id: 'mockRowGroupModel',
  group: [mockInputWithFormFieldValueModel],
});

export const fileFormEditInputConfig = {
  name: 'dc.title',
  id: 'dc_title',
  readOnly: false,
  disabled: false,
};

export const mockFileFormEditInputModel = new DsDynamicInputModel(fileFormEditInputConfig);

export const mockFileFormEditRowGroupModel = new DynamicRowGroupModel({
  id: 'mockRowGroupModel',
  group: [mockFileFormEditInputModel]
});
