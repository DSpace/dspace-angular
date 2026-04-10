import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { PrivacyComponent as BaseComponent } from '../../../../../app/info/privacy/privacy.component';

@Component({
  selector: 'ds-themed-privacy',
  styleUrls: ['./privacy.component.scss'],
  templateUrl: './privacy.component.html',
  imports: [
    RouterLink,
    TranslateModule,
  ],
})
export class PrivacyComponent extends BaseComponent {
}
