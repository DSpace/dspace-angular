import { Injectable } from '@angular/core';
import { AccessControlItem } from '../../../shared/access-control-array-form/access-control-array-form.component';
import { Observable, of } from 'rxjs';

export interface AccessControlDropdownDataResponse {
  id: string;
  itemAccessConditionOptions: AccessControlItem[];
  bitstreamAccessConditionOptions: AccessControlItem[];
}

@Injectable()
export class CommunityAccessControlService {
  dropdownData$: Observable<AccessControlDropdownDataResponse> = of(accessControlDropdownData);
}

const accessControlDropdownData: AccessControlDropdownDataResponse = {
  'id': 'default',
  'itemAccessConditionOptions': [
    {
      'name': 'openaccess'
    },
    {
      'name': 'administrator'
    },
    {
      'name': 'embargo',
      'hasStartDate': true,
      'maxStartDate': '2018-06-24T00:40:54.970+0000'
    },
    {
      'name': 'lease',
      'hasEndDate': true,
      'maxEndDate': '2017-12-24T00:40:54.970+0000'
    }
  ],
  'bitstreamAccessConditionOptions': [
    {
      'name': 'openaccess'
    },
    {
      'name': 'administrator'
    },
    {
      'name': 'embargo',
      'hasStartDate': true,
      'maxStartDate': '2018-06-24T00:40:54.970+0000'
    },
    {
      'name': 'lease',
      'hasEndDate': true,
      'maxEndDate': '2017-12-24T00:40:54.970+0000'
    }
  ]
};
