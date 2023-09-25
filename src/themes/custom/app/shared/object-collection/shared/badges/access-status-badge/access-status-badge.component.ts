import { Component } from '@angular/core';
import {
  AccessStatusBadgeComponent as BaseComponent
} from 'src/app/shared/object-collection/shared/badges/access-status-badge/access-status-badge.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-access-status-badge',
  // styleUrls: ['./access-status-badge.component.scss'],
  // templateUrl: './access-status-badge.component.html',
  templateUrl: '../../../../../../../../app/shared/object-collection/shared/badges/access-status-badge/access-status-badge.component.html',
  standalone: true,
  imports: [NgIf, AsyncPipe, TranslateModule]
})
export class AccessStatusBadgeComponent extends BaseComponent {
}
