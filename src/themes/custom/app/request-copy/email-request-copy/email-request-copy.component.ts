import { Component } from '@angular/core';
import {
  EmailRequestCopyComponent as BaseComponent
} from 'src/app/request-copy/email-request-copy/email-request-copy.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-email-request-copy',
  // styleUrls: ['./email-request-copy.component.scss'],
  styleUrls: [],
  // templateUrl: './email-request-copy.component.html',
  templateUrl: './../../../../../app/request-copy/email-request-copy/email-request-copy.component.html',
  standalone: true,
  imports: [FormsModule, NgClass, NgIf, TranslateModule]
})
export class EmailRequestCopyComponent
  extends BaseComponent {
}
