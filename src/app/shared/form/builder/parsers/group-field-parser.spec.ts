import { GroupFieldParser } from './group-field-parser';
import { ParserOptions } from './parser-options';
import { DynamicGroupModel } from '../ds-dynamic-form-ui/models/dynamic-group/dynamic-group.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { FormFieldModel } from '../models/form-field.model';

describe('GroupFieldParser test suite', () => {
  let field: FormFieldModel;
  let initFormValues = {};

  const parserOptions: ParserOptions = {
    readOnly: false,
    submissionScope: 'testScopeUUID',
    authorityUuid: 'WORKSPACE'
  };

  beforeEach(() => {
    field = {
      input: {
        type: 'group'
      },
      rows: [
        {
          fields: [
            {
              input: {
                type: 'onebox'
              },
              label: 'Author',
              mandatory: 'false',
              repeatable: false,
              hints: 'Enter the name of the author.',
              selectableMetadata: [
                {
                  metadata: 'author'
                }
              ],
              languageCodes: []
            },
            {
              input: {
                type: 'onebox'
              },
              label: 'Affiliation',
              mandatory: false,
              repeatable: true,
              hints: 'Enter the affiliation of the author.',
              selectableMetadata: [
                {
                  metadata: 'affiliation'
                }
              ],
              languageCodes: []
            }
          ]
        }
      ],
      label: 'Authors',
      mandatory: 'true',
      repeatable: false,
      mandatoryMessage: 'Entering at least the first author is mandatory.',
      hints: 'Enter the names of the authors of this item.',
      selectableMetadata: [
        {
          metadata: 'author'
        }
      ],
      languageCodes: []
    } as FormFieldModel;

  });

  it('should init parser properly', () => {
    const parser = new GroupFieldParser(field, initFormValues, parserOptions);

    expect(parser instanceof GroupFieldParser).toBe(true);
  });

  it('should return a DynamicGroupModel object', () => {
    const parser = new GroupFieldParser(field, initFormValues, parserOptions);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicGroupModel).toBe(true);
  });

  it('should throw when rows configuration is empty', () => {
    field.rows = null;
    const parser = new GroupFieldParser(field, initFormValues, parserOptions);

    expect(() => parser.parse())
      .toThrow();
  });

  it('should set group init value properly', () => {
    initFormValues = {
      author: [new FormFieldMetadataValueObject('test author')],
      affiliation: [new FormFieldMetadataValueObject('test affiliation')]
    };
    const parser = new GroupFieldParser(field, initFormValues, parserOptions);

    const fieldModel = parser.parse();
    const expectedValue = [{
      author: new FormFieldMetadataValueObject('test author'),
      affiliation: new FormFieldMetadataValueObject('test affiliation')
    }];

    expect(fieldModel.value).toEqual(expectedValue);
  });

});
