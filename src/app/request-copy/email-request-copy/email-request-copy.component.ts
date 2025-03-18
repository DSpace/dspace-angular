import 'altcha';

import {
  Location,
  NgClass,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { BtnDisabledDirective } from '../../shared/btn-disabled.directive';
import { hasValue } from '../../shared/empty.util';
import { RequestCopyEmail } from './request-copy-email.model';

@Component({
  selector: 'ds-base-email-request-copy',
  styleUrls: ['./email-request-copy.component.scss'],
  templateUrl: './email-request-copy.component.html',
  standalone: true,
  imports: [FormsModule, NgClass, TranslateModule, BtnDisabledDirective, NgbDropdownModule],
})
/**
 * A form component for an email to send back to the user requesting an item
 */
export class EmailRequestCopyComponent implements OnInit {
  /**
   * Event emitter for sending the email
   */
  @Output() send: EventEmitter<RequestCopyEmail> = new EventEmitter<RequestCopyEmail>();
  @Output() selectedAccessPeriod: EventEmitter<string> = new EventEmitter();

  /**
   * The subject of the email
   */
  @Input() subject: string;

  /**
   * The contents of the email
   */
  @Input() message: string;

  /**
   * A list of valid access periods to render in a drop-down menu
   */
  @Input() validAccessPeriods: string [] = [];

  /**
   * The selected access period, e.g. +7DAYS, +12MONTHS, FOREVER. These will be
   * calculated as a timestamp to store as the access expiry date for the requested item
   */
  accessPeriod = 'FOREVER';

  protected readonly hasValue = hasValue;

  constructor(protected location: Location) {
  }

  ngOnInit(): void {
    // If access periods are present, set the default to the first in the array
    if (hasValue(this.validAccessPeriods) && this.validAccessPeriods.length > 0) {
      this.selectAccessPeriod(this.validAccessPeriods[0]);
    }
  }

  /**
   * Submit the email
   */
  submit() {
    this.send.emit(new RequestCopyEmail(this.subject, this.message));
  }

  /**
   * Return to the previous page
   */
  return() {
    this.location.back();
  }

  /**
   * Update the access period when a dropdown menu button is clicked for a value
   * @param accessPeriod
   */
  selectAccessPeriod(accessPeriod: string) {
    this.accessPeriod = accessPeriod;
    this.selectedAccessPeriod.emit(accessPeriod);
  }

}
