import { Component } from '@angular/core';
import { BadgesComponent as BaseComponent } from 'src/app/shared/object-collection/shared/badges/badges.component';

import { ThemedAccessStatusBadgeComponent } from '../../../../../../../app/shared/object-collection/shared/badges/access-status-badge/themed-access-status-badge.component';
import { ThemedMyDSpaceStatusBadgeComponent } from '../../../../../../../app/shared/object-collection/shared/badges/my-dspace-status-badge/themed-my-dspace-status-badge.component';
import { ThemedStatusBadgeComponent } from '../../../../../../../app/shared/object-collection/shared/badges/status-badge/themed-status-badge.component';
import { ThemedTypeBadgeComponent } from '../../../../../../../app/shared/object-collection/shared/badges/type-badge/themed-type-badge.component';

@Component({
  selector: 'ds-themed-badges',
  // styleUrls: ['./badges.component.scss'],
  styleUrls: ['../../../../../../../app/shared/object-collection/shared/badges/badges.component.scss'],
  // templateUrl: './badges.component.html',
  templateUrl: '../../../../../../../app/shared/object-collection/shared/badges/badges.component.html',
  standalone: true,
  imports: [
    ThemedAccessStatusBadgeComponent,
    ThemedMyDSpaceStatusBadgeComponent,
    ThemedStatusBadgeComponent,
    ThemedTypeBadgeComponent,
  ],
})
export class BadgesComponent extends BaseComponent {
}
