import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RequestCopyEmail } from './request-copy-email.model';
import { Location } from '@angular/common';

@Component({
  selector: 'ds-email-request-copy',
  styleUrls: ['./email-request-copy.component.scss'],
  templateUrl: './email-request-copy.component.html'
})
export class EmailRequestCopyComponent {
  @Output() send: EventEmitter<RequestCopyEmail> = new EventEmitter<RequestCopyEmail>();

  @Input() subject: string;
  @Input() message: string;

  constructor(protected location: Location) {
  }

  submit() {
    this.send.emit(new RequestCopyEmail(this.subject, this.message));
  }

  return() {
    this.location.back();
  }
}
