import {
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { Group } from '../../../../core/eperson/models/group.model';
import { ResourcePolicy } from '../../../../core/resource-policy/models/resource-policy.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { isEmpty } from '../../../../shared/empty.util';

/**
 * This component represents a badge that describe an access condition
 */
@Component({
  selector: 'ds-submission-section-upload-access-conditions',
  templateUrl: './submission-section-upload-access-conditions.component.html',
  imports: [
    NgForOf,
    NgIf,
  ],
  standalone: true,
})
export class SubmissionSectionUploadAccessConditionsComponent implements OnInit {

  /**
   * The list of resource policy
   * @type {Array}
   */
  @Input() accessConditions: ResourcePolicy[];

  /**
   * The list of access conditions
   * @type {Array}
   */
  public accessConditionsList: ResourcePolicy[] = [];

  constructor(
    public dsoNameService: DSONameService,
    protected groupService: GroupDataService,
  ) {
  }

  /**
   * Retrieve access conditions list
   */
  ngOnInit() {
    this.accessConditions.forEach((accessCondition: ResourcePolicy) => {
      if (isEmpty(accessCondition.name)) {
        this.groupService.findByHref(accessCondition._links.group.href).pipe(
          getFirstCompletedRemoteData(),
        ).subscribe((rd: RemoteData<Group>) => {
          if (rd.hasSucceeded) {
            const group: Group = rd.payload;
            const accessConditionEntry = Object.assign({}, accessCondition);
            accessConditionEntry.name = this.dsoNameService.getName(group);
            this.accessConditionsList.push(accessConditionEntry);
          }
        });
      } else {
        this.accessConditionsList.push(accessCondition);
      }
    });
  }
}
