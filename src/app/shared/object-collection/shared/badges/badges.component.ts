import { NgIf } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { Context } from 'src/app/core/shared/context.model';

import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { ThemedAccessStatusBadgeComponent } from './access-status-badge/themed-access-status-badge.component';
import { ThemedMyDSpaceStatusBadgeComponent } from './my-dspace-status-badge/themed-my-dspace-status-badge.component';
import { ThemedStatusBadgeComponent } from './status-badge/themed-status-badge.component';
import { ThemedTypeBadgeComponent } from './type-badge/themed-type-badge.component';

/**
 * List of MyDSpace Status Contexts
 */
const MY_DSPACE_STATUS_CONTEXTS = [
  Context.MyDSpaceArchived,
  Context.MyDSpaceWorkspace,
  Context.MyDSpaceWorkflow,
  Context.MyDSpaceDeclined,
  Context.MyDSpaceApproved,
  Context.MyDSpaceWaitingController,
  Context.MyDSpaceValidation,
];

/**
 * Component that renders all the badges for a listable object
 */
@Component({
  selector: 'ds-base-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss'],
  standalone: true,
  imports: [ThemedStatusBadgeComponent, NgIf, ThemedMyDSpaceStatusBadgeComponent, ThemedTypeBadgeComponent, ThemedAccessStatusBadgeComponent],
})
export class BadgesComponent {
  /**
   * The DSpaceObject to render the badge for
   */
  @Input() object: DSpaceObject;
  /**
   * The context that the badge is rendered in
   */
  @Input() context?: Context;

  /**
   * Whether or not to show the access status
   */
  @Input() showAccessStatus = false;

  /**
   * Returns whether or not this context is a MyDSpace status context
   */
  get isMyDSpaceStatus(): boolean {
    return MY_DSPACE_STATUS_CONTEXTS.includes(this.context);
  }
}
