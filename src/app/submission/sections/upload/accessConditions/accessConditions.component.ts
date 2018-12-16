import { Component, Input, OnInit } from '@angular/core';

import { filter, first } from 'rxjs/operators';

import { GroupEpersonService } from '../../../../core/eperson/group-eperson.service';
import { ResourcePolicy } from '../../../../core/shared/resource-policy.model';
import { isEmpty } from '../../../../shared/empty.util';
import { Group } from '../../../../core/eperson/models/group.model';
import { RemoteData } from '../../../../core/data/remote-data';

@Component({
  selector: 'ds-access-conditions',
  templateUrl: './accessConditions.component.html',
})
export class AccessConditionsComponent implements OnInit {

  @Input() accessConditions: ResourcePolicy[];

  public accessConditionsList = [];

  constructor(private groupService: GroupEpersonService) {}

  ngOnInit() {
    this.accessConditions.forEach((accessCondition: ResourcePolicy) => {
      if (isEmpty(accessCondition.name)) {
        this.groupService.findById(accessCondition.groupUUID).pipe(
          filter((rd: RemoteData<Group>) => !rd.isResponsePending && rd.hasSucceeded),
          first())
          .subscribe((rd: RemoteData<Group>) => {
            const group: Group = rd.payload;
            const accessConditionEntry = Object.assign({}, accessCondition);
            accessConditionEntry.name = group.name;
            this.accessConditionsList.push(accessConditionEntry);
          })
      } else {
        this.accessConditionsList.push(accessCondition);
      }
    })
  }
}
