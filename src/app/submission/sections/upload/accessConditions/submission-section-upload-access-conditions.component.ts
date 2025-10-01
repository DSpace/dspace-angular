
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { GroupDataService } from '@dspace/core/eperson/group-data.service';
import { Group } from '@dspace/core/eperson/models/group.model';
import { ResourcePolicy } from '@dspace/core/resource-policy/models/resource-policy.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { isEmpty } from '@dspace/shared/utils/empty.util';

/**
 * This component represents a badge that describe an access condition
 */
@Component({
  selector: 'ds-submission-section-upload-access-conditions',
  templateUrl: './submission-section-upload-access-conditions.component.html',
  imports: [],
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
