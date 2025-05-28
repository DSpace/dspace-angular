import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MyDSpaceStatusBadgeComponent as BaseComponent } from 'src/app/shared/object-collection/shared/badges/my-dspace-status-badge/my-dspace-status-badge.component';

@Component({
  selector: 'ds-themed-my-dspace-status-badge',
  // styleUrls: ['./my-dspace-status-badge.component.scss'],
  styleUrls: ['../../../../../../../../app/shared/object-collection/shared/badges/my-dspace-status-badge/my-dspace-status-badge.component.scss'],
  // templateUrl: './my-dspace-status-badge.component.html',
  templateUrl: '../../../../../../../../app/shared/object-collection/shared/badges/my-dspace-status-badge/my-dspace-status-badge.component.html',
  standalone: true,
  imports: [
    TranslateModule,
  ],
})
export class MyDSpaceStatusBadgeComponent extends BaseComponent {
}
