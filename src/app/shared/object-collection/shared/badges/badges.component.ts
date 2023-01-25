import { Component, Input } from '@angular/core';
import { Context } from 'src/app/core/shared/context.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';

const MY_DSPACE_STATUS_CONTEXTS = [
  Context.MyDSpaceArchived,
  Context.MyDSpaceWorkspace,
  Context.MyDSpaceWorkflow,
  Context.MyDSpaceDeclined,
  Context.MyDSpaceApproved,
  Context.MyDSpaceWaitingController,
  Context.MyDSpaceValidation
];
@Component({
  selector: 'ds-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss']
})
export class BadgesComponent {
  @Input() object: DSpaceObject;
  @Input() context?: Context;
  @Input() showAccessStatus = false;
  get isMyDSpaceStatus(): boolean {
    return MY_DSPACE_STATUS_CONTEXTS.includes(this.context);
  }
}
