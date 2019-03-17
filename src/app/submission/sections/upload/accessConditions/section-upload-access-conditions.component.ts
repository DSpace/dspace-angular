import { Component, Input, OnInit } from '@angular/core';

import { find } from 'rxjs/operators';

import { GroupEpersonService } from '../../../../core/eperson/group-eperson.service';
import { ResourcePolicy } from '../../../../core/shared/resource-policy.model';
import { isEmpty } from '../../../../shared/empty.util';
import { Group } from '../../../../core/eperson/models/group.model';
import { RemoteData } from '../../../../core/data/remote-data';

@Component({
  selector: 'ds-section-upload-access-conditions',
  templateUrl: './section-upload-access-conditions.component.html',
})
export class SectionUploadAccessConditionsComponent implements OnInit {

  @Input() accessConditions: ResourcePolicy[];

  public accessConditionsList = [];

  constructor(private groupService: GroupEpersonService) {}

  ngOnInit() {
    this.accessConditions.forEach((accessCondition: ResourcePolicy) => {
      if (isEmpty(accessCondition.name)) {
        this.groupService.findById(accessCondition.groupUUID).pipe(
          find((rd: RemoteData<Group>) => !rd.isResponsePending && rd.hasSucceeded))
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
