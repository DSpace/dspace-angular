import { SubmissionFormsConfigService } from '../../core/config/submission-forms-config.service';
import { SubmissionFormsModel } from 'src/app/core/config/models/config-submission-forms.model';
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';

const configRes = Object.assign(new SubmissionFormsModel(), {
  'id': 'AccessConditionDefaultConfiguration',
  'canChangeDiscoverable': true,
  'accessConditionOptions': [
    {
      'name': 'openaccess',
      'hasStartDate': false,
      'hasEndDate': false
    },
    {
      'name': 'lease',
      'hasStartDate': false,
      'hasEndDate': true,
      'maxEndDate': '2022-06-20T12:17:44.420+00:00'
    },
    {
      'name': 'embargo',
      'hasStartDate': true,
      'hasEndDate': false,
      'maxStartDate': '2024-12-20T12:17:44.420+00:00'
    },
    {
      'name': 'administrator',
      'hasStartDate': false,
      'hasEndDate': false
    }
  ],
  'type': 'submissionaccessoption',
  '_links': {
    'self': {
      'href': 'http://localhost:8080/server/api/config/submissionaccessoptions/AccessConditionDefaultConfiguration'
    }
  }
});

export function getSubmissionAccessesConfigService(): SubmissionFormsConfigService {
  return jasmine.createSpyObj('SubmissionAccessesConfigService', {
    findByHref: createSuccessfulRemoteDataObject$(configRes),
  });
}
