import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AccessControlItem } from '../../../core/shared/bulk-access-condition-options.model';

export interface AccessControlDropdownDataResponse {
  id: string;
  itemAccessConditionOptions: AccessControlItem[];
  bitstreamAccessConditionOptions: AccessControlItem[];
}

@Injectable()
export class ItemAccessControlService {
  dropdownData$: Observable<AccessControlDropdownDataResponse> = of(accessControlDropdownData);


  execute(payload: any) {
    console.log('execute', payload);

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });

    const file = new File([blob], 'data.json', {
      type: 'application/json',
    });

    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  }
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
      'maxStartDate': '2023-05-12T00:40:54.970+0000'
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
