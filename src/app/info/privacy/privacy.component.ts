import { Component } from '@angular/core';
import { PrivacyContentComponent } from './privacy-content/privacy-content.component';

@Component({
    selector: 'ds-privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.scss'],
    standalone: true,
    imports: [PrivacyContentComponent]
})
/**
 * Component displaying the Privacy Statement
 */
export class PrivacyComponent {
}
