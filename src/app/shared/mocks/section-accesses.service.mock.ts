import { of as observableOf } from 'rxjs';

import { SubmissionFormsModel } from '../../../../modules/core/src/lib/core/config/models/config-submission-forms.model';

const dataRes = Object.assign(new SubmissionFormsModel(), {
  'id': 'AccessConditionDefaultConfiguration',
  'accessConditions': [],
});

export function getSectionAccessesService() {
  return jasmine.createSpyObj('SectionAccessesService', {
    getAccessesData: observableOf(dataRes),
  });
}
