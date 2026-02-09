import { Component } from '@angular/core';

import { PrivacyContentComponent } from './privacy-content/privacy-content.component';

@Component({
  selector: 'ds-base-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
  imports: [
    PrivacyContentComponent,
  ],
})
/**
 * Component displaying the Privacy Statement
 */
export class PrivacyComponent {
}
