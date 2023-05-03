import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { BulkAccessConditionOptionsService } from '../../../core/data/bulk-access-condition-options.service';
import { BulkAccessConditionOptions } from '../../../core/shared/bulk-access-condition-options.model';


@Injectable()
export class CommunityAccessControlService {
  constructor(private service: BulkAccessConditionOptionsService) {}

  dropdownData$ = of(accessControlDropdownData);

  // dropdownData$ = this.service.getAll().pipe(
  //   getAllSucceededRemoteData(),
  //   filter((data) => data.hasSucceeded),
  //   map((data) => data.payload)
  // );
}

const accessControlDropdownData: BulkAccessConditionOptions = {
  _links: { self: undefined }, type: undefined, uuid: '',
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
