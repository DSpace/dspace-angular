import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AccessStatusBadgeComponent as BaseComponent } from 'src/app/shared/object-collection/shared/badges/access-status-badge/access-status-badge.component';

@Component({
  selector: 'ds-themed-access-status-badge',
  // styleUrls: ['./access-status-badge.component.scss'],
  // templateUrl: './access-status-badge.component.html',
  templateUrl: '../../../../../../../../app/shared/object-collection/shared/badges/access-status-badge/access-status-badge.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    TranslateModule,
  ],
})
export class AccessStatusBadgeComponent extends BaseComponent {
}
