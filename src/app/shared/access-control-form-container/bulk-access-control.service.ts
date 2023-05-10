import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AccessControlItem } from '../../core/shared/bulk-access-condition-options.model';
import { ScriptDataService } from '../../core/data/processes/script-data.service';
import { ProcessParameter } from '../../process-page/processes/process-parameter.model';

export interface AccessControlDropdownDataResponse {
  id: string;
  itemAccessConditionOptions: AccessControlItem[];
  bitstreamAccessConditionOptions: AccessControlItem[];
}

@Injectable({ providedIn: 'root' })
export class BulkAccessControlService {
  constructor(private scriptService: ScriptDataService) {}

  dropdownData$: Observable<AccessControlDropdownDataResponse> = of(accessControlDropdownData);

  createPayloadFile(payload: any) {
    console.log('execute', payload);

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });

    const file = new File([blob], 'data.json', {
      type: 'application/json',
    });

    const url = URL.createObjectURL(file);
    window.open(url, '_blank'); // remove this later

    return { url, file };
  }

  executeScript(uuids: string[], file: File) {
    console.log('execute', { uuids, file });

    const params: ProcessParameter[] = [
      { name: 'uuid', value: uuids.join(',') },
    ];

    return this.scriptService.invoke('bulk-access-control', params, [file]);
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
