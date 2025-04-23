import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-privacy-content',
  templateUrl: './privacy-content.component.html',
  styleUrls: ['./privacy-content.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
  ],
})
/**
 * Component displaying the contents of the Privacy Statement
 */
export class PrivacyContentComponent {
}
