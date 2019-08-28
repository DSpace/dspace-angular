import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { TagFieldParser } from './tag-field-parser';
import { DynamicTagModel } from '../ds-dynamic-form-ui/models/tag/dynamic-tag.model';
import { ParserOptions } from './parser-options';
import { WorkspaceItem } from '../../../../core/submission/models/workspaceitem.model';

describe('TagFieldParser test suite', () => {
  let field: FormFieldModel;
  let initFormValues: any = {};

  const parserOptions: ParserOptions = {
    readOnly: false,
    submissionScope: 'testScopeUUID',
    authorityUuid: null
  };

  beforeEach(() => {
    field = {
      input: {
        type: 'tag'
      },
      label: 'Keywords',
      mandatory: 'false',
      repeatable: false,
      hints: 'Local controlled vocabulary.',
      selectableMetadata: [
        {
          metadata: 'subject',
          authority: 'JOURNALAuthority',
          closed: false
        }
      ],
      languageCodes: []
    } as FormFieldModel;

  });

  it('should init parser properly', () => {
    const parser = new TagFieldParser(field, initFormValues, parserOptions, new WorkspaceItem());

    expect(parser instanceof TagFieldParser).toBe(true);
  });

  it('should return a DynamicTagModel object when repeatable option is false', () => {
    const parser = new TagFieldParser(field, initFormValues, parserOptions, new WorkspaceItem());

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicTagModel).toBe(true);
  });

  it('should set init value properly', () => {
    initFormValues = {
      subject: [
        new FormFieldMetadataValueObject('test subject'),
        new FormFieldMetadataValueObject('another test subject'),
      ],
    };

    const parser = new TagFieldParser(field, initFormValues, parserOptions, new WorkspaceItem());

    const fieldModel = parser.parse();

    expect(fieldModel.value).toEqual(initFormValues.subject);
  });

});
