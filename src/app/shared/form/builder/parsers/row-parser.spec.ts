import { FormFieldModel } from '../models/form-field.model';
import { FormRowModel } from '../../../../core/shared/config/config-submission-forms.model';
import { RowParser } from './row-parser';
import { DynamicRowGroupModel } from '../ds-dynamic-form-ui/models/ds-dynamic-row-group-model';
import { DynamicRowArrayModel } from '../ds-dynamic-form-ui/models/ds-dynamic-row-array-model';

describe('RowParser test suite', () => {

  let row1: FormRowModel;
  let row2: FormRowModel;
  let row3: FormRowModel;

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
          input: {type: 'onebox'},
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
        }
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
        },
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
        }
      ]
    } as FormRowModel;

  });

  it('should init parser properly', () => {
    const parser = new RowParser(row1, scopeUUID, initFormValues, submissionScope, readOnly);

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
