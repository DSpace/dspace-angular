import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-end-user-agreement-content',
  templateUrl: './end-user-agreement-content.component.html',
  styleUrls: ['./end-user-agreement-content.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
  ],
})
/**
 * Component displaying the contents of the End User Agreement
 */
export class EndUserAgreementContentComponent {
}
