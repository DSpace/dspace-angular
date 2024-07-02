import {
  NgClass,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EmailRequestCopyComponent as BaseComponent } from 'src/app/request-copy/email-request-copy/email-request-copy.component';

@Component({
  selector: 'ds-themed-email-request-copy',
  // styleUrls: ['./email-request-copy.component.scss'],
  styleUrls: [],
  // templateUrl: './email-request-copy.component.html',
  templateUrl: './../../../../../app/request-copy/email-request-copy/email-request-copy.component.html',
  standalone: true,
  imports: [FormsModule, NgClass, NgIf, TranslateModule],
})
export class EmailRequestCopyComponent
  extends BaseComponent {
}
