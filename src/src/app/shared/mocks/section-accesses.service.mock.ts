import { of } from 'rxjs';

import { SubmissionFormsModel } from '../../core/config/models/config-submission-forms.model';

const dataRes = Object.assign(new SubmissionFormsModel(), {
  'id': 'AccessConditionDefaultConfiguration',
  'accessConditions': [],
});

export function getSectionAccessesService() {
  return jasmine.createSpyObj('SectionAccessesService', {
    getAccessesData: of(dataRes),
  });
}
