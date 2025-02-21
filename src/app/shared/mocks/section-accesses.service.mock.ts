import { of as observableOf } from 'rxjs';

import { SubmissionFormsModel } from '@dspace/core';

const dataRes = Object.assign(new SubmissionFormsModel(), {
  'id': 'AccessConditionDefaultConfiguration',
  'accessConditions': [],
});

export function getSectionAccessesService() {
  return jasmine.createSpyObj('SectionAccessesService', {
    getAccessesData: observableOf(dataRes),
  });
}
