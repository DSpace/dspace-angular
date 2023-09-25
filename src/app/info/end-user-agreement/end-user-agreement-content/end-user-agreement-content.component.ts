import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'ds-end-user-agreement-content',
    templateUrl: './end-user-agreement-content.component.html',
    styleUrls: ['./end-user-agreement-content.component.scss'],
    standalone: true,
    imports: [RouterLink, TranslateModule]
})
/**
 * Component displaying the contents of the End User Agreement
 */
export class EndUserAgreementContentComponent {
}
