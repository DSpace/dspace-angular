import { Component } from '@angular/core';
import {
    EmailRequestCopyComponent as BaseComponent
} from 'src/app/request-copy/email-request-copy/email-request-copy.component';

@Component({
    selector: 'ds-email-request-copy',
    // styleUrls: ['./email-request-copy.component.scss'],
    styleUrls: [],
    // templateUrl: './email-request-copy.component.html',
    templateUrl: './../../../../../app/request-copy/email-request-copy/email-request-copy.component.html',
})
export class EmailRequestCopyComponent
    extends BaseComponent {
}
