import 'altcha';

import {
  Location,
  NgClass,
  NgForOf,
  NgIf,
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
  imports: [FormsModule, NgClass, NgIf, TranslateModule, BtnDisabledDirective, NgForOf, NgbDropdownModule],
})
/**
 * A form component for an email to send back to the user requesting an item
 */
export class EmailRequestCopyComponent implements OnInit {
  /**
   * Event emitter for sending the email
   */
  @Output() send: EventEmitter<RequestCopyEmail> = new EventEmitter<RequestCopyEmail>();
  @Output() selectedAccessPeriod: EventEmitter<number> = new EventEmitter();

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
  @Input() validAccessPeriods: number[] = [];

  /**
   * The selected access period
   */
  accessPeriod = 0;

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
  selectAccessPeriod(accessPeriod: number) {
    this.accessPeriod = accessPeriod;
    this.selectedAccessPeriod.emit(accessPeriod);
  }

}
