import { SubmissionFormsModel } from '@dspace/core';
import { of as observableOf } from 'rxjs';

const dataRes = Object.assign(new SubmissionFormsModel(), {
  'id': 'AccessConditionDefaultConfiguration',
  'accessConditions': [],
});

export function getSectionAccessesService() {
  return jasmine.createSpyObj('SectionAccessesService', {
    getAccessesData: observableOf(dataRes),
  });
}
