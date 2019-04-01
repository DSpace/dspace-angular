import { FormFieldModel } from '../models/form-field.model';
import { FormRowModel } from '../../../../core/config/models/config-submission-forms.model';
import { RowParser } from './row-parser';
import { DynamicRowGroupModel } from '../ds-dynamic-form-ui/models/ds-dynamic-row-group-model';
import { DynamicRowArrayModel } from '../ds-dynamic-form-ui/models/ds-dynamic-row-array-model';

describe('RowParser test suite', () => {

  let row1: FormRowModel;
  let row2: FormRowModel;
  let row3: FormRowModel;
  let row4: FormRowModel;
  let row5: FormRowModel;
  let row6: FormRowModel;
  let row7: FormRowModel;
  let row8: FormRowModel;
  let row9: FormRowModel;
  let row10: FormRowModel;

  const scopeUUID = 'testScopeUUID';
  const initFormValues = {};
  const submissionScope = 'WORKSPACE';
  const readOnly = false;

  beforeEach(() => {
    row1 = {
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
        } as FormFieldModel,
        {
          input: {type: 'name'},
          label: 'Name',
          mandatory: 'false',
          repeatable: false,
          hints: 'Enter full name.',
          selectableMetadata: [
            {
              metadata: 'name'
            }
          ],
          languageCodes: []
        } as FormFieldModel
      ]
    } as FormRowModel;
    row2 = {
      fields: [
        {
          input: {
            type: 'onebox',
            regex: '^[a-zA-Z0-9]+$'
          },
          label: 'Title',
          mandatory: 'false',
          repeatable: true,
          hints: 'Enter the name of the events, if any.',
          selectableMetadata: [
            {
              metadata: 'title',
              authority: 'EVENTAuthority',
              closed: false
            }
          ],
          languageCodes: []
        } as FormFieldModel
      ]
    } as FormRowModel;

    row3 = {
      fields: [
        {
          input: {type: 'onebox'},
          label: 'Title',
          mandatory: 'false',
          repeatable: false,
          hints: 'Enter the name of the events, if any.',
          selectableMetadata: [
            {
              metadata: 'title',
              authority: 'EVENTAuthority',
              closed: false
            }
          ],
          languageCodes: []
        } as FormFieldModel,
        {
          input: {type: 'onebox'},
          label: 'Other title',
          mandatory: 'false',
          repeatable: false,
          hints: 'Enter the name of the events, if any.',
          scope: 'WORKFLOW',
          selectableMetadata: [
            {
              metadata: 'otherTitle',
              authority: 'EVENTAuthority',
              closed: false
            }
          ],
          languageCodes: []
        } as FormFieldModel
      ]
    } as FormRowModel;

    row4 = {
      fields: [
        {
          input: {
            type: 'dropdown'
          },
          label: 'Type',
          mandatory: 'false',
          repeatable: false,
          hints: 'Select the tyupe.',
          selectableMetadata: [
            {
              metadata: 'type',
              authority: 'common_types_dataset',
              closed: false
            }
          ],
          languageCodes: []
        } as FormFieldModel,
        {
          input: {type: 'series'},
          label: 'Series/Report No.',
          mandatory: 'false',
          repeatable: false,
          hints: 'Enter the series and number assigned to this item by your community.',
          selectableMetadata: [
            {
              metadata: 'series',
            }
          ],
          languageCodes: []
        } as FormFieldModel
      ]
    } as FormRowModel;

    row5 = {
      fields: [
        {
          input: {
            type: 'lookup-name'
          },
          label: 'Author',
          mandatory: 'false',
          repeatable: false,
          hints: 'Enter the name of the author.',
          selectableMetadata: [
            {
              metadata: 'author',
              authority: 'RPAuthority',
              closed: false
            }
          ],
          languageCodes: []
        } as FormFieldModel
      ]
    } as FormRowModel;

    row6 = {
      fields: [
        {
          input: {
            type: 'list'
          },
          label: 'Type',
          mandatory: 'false',
          repeatable: true,
          hints: 'Select the type.',
          selectableMetadata: [
            {
              metadata: 'type',
              authority: 'type_programme',
              closed: false
            }
          ],
          languageCodes: []
        } as FormFieldModel
      ]
    } as FormRowModel;

    row7 = {
      fields: [
        {
          input: {
            type: 'date'
          },
          label: 'Date of Issue.',
          mandatory: 'true',
          repeatable: false,
          hints: 'Please give the date of previous publication or public distribution. You can leave out the day and/or month if they aren\'t applicable.',
          mandatoryMessage: 'You must enter at least the year.',
          selectableMetadata: [
            {
              metadata: 'date',
            }
          ],
          languageCodes: []
        } as FormFieldModel
      ]
    } as FormRowModel;

    row8 = {
      fields: [
        {
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
        } as FormFieldModel
      ]
    } as FormRowModel;

    row9 = {
      fields: [
        {
          input: {
            type: 'textarea'
          },
          label: 'Description',
          mandatory: 'false',
          repeatable: false,
          hints: 'Enter a description.',
          selectableMetadata: [
            {
              metadata: 'description'
            }
          ],
          languageCodes: []
        } as FormFieldModel
      ]
    } as FormRowModel;

    row10 = {
      fields: [
        {
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
        } as FormFieldModel
      ]
    } as FormRowModel;
  });

  it('should init parser properly', () => {
    let parser = new RowParser(row1, scopeUUID, initFormValues, submissionScope, readOnly);

    expect(parser instanceof RowParser).toBe(true);

    parser = new RowParser(row2, scopeUUID, initFormValues, submissionScope, readOnly);

    expect(parser instanceof RowParser).toBe(true);

    parser = new RowParser(row3, scopeUUID, initFormValues, submissionScope, readOnly);

    expect(parser instanceof RowParser).toBe(true);

    parser = new RowParser(row4, scopeUUID, initFormValues, submissionScope, readOnly);

    expect(parser instanceof RowParser).toBe(true);

    parser = new RowParser(row5, scopeUUID, initFormValues, submissionScope, readOnly);

    expect(parser instanceof RowParser).toBe(true);

    parser = new RowParser(row6, scopeUUID, initFormValues, submissionScope, readOnly);

    expect(parser instanceof RowParser).toBe(true);

    parser = new RowParser(row7, scopeUUID, initFormValues, submissionScope, readOnly);

    expect(parser instanceof RowParser).toBe(true);

    parser = new RowParser(row8, scopeUUID, initFormValues, submissionScope, readOnly);

    expect(parser instanceof RowParser).toBe(true);

    parser = new RowParser(row9, scopeUUID, initFormValues, submissionScope, readOnly);

    expect(parser instanceof RowParser).toBe(true);

    parser = new RowParser(row10, scopeUUID, initFormValues, submissionScope, readOnly);

    expect(parser instanceof RowParser).toBe(true);
  });

  it('should return a DynamicRowGroupModel object', () => {
    const parser = new RowParser(row1, scopeUUID, initFormValues, submissionScope, readOnly);

    const rowModel = parser.parse();

    expect(rowModel instanceof DynamicRowGroupModel).toBe(true);
  });

  it('should return a row with three fields', () => {
    const parser = new RowParser(row1, scopeUUID, initFormValues, submissionScope, readOnly);

    const rowModel = parser.parse();

    expect((rowModel as DynamicRowGroupModel).group.length).toBe(3);
  });

  it('should return a DynamicRowArrayModel object', () => {
    const parser = new RowParser(row2, scopeUUID, initFormValues, submissionScope, readOnly);

    const rowModel = parser.parse();

    expect(rowModel instanceof DynamicRowArrayModel).toBe(true);
  });

  it('should return a row that contains only scoped fields', () => {
    const parser = new RowParser(row3, scopeUUID, initFormValues, submissionScope, readOnly);

    const rowModel = parser.parse();

    expect((rowModel as DynamicRowGroupModel).group.length).toBe(1);
  });
});
