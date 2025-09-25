import {
  AsyncPipe,
  Location,
  NgClass,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  Subject,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BtnDisabledDirective } from '../../shared/btn-disabled.directive';
import { hasValue } from '../../shared/empty.util';
import { RequestCopyEmail } from './request-copy-email.model';

@Component({
  selector: 'ds-base-email-request-copy',
  styleUrls: ['./email-request-copy.component.scss'],
  templateUrl: './email-request-copy.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    FormsModule,
    NgbDropdownModule,
    NgClass,
    TranslateModule,
  ],
})
/**
 * A form component for an email to send back to the user requesting an item
 */
export class EmailRequestCopyComponent implements OnInit, OnDestroy {
  /**
   * Event emitter for sending the email
   */
  @Output() send: EventEmitter<RequestCopyEmail> = new EventEmitter<RequestCopyEmail>();

  /**
   * Selected access period emmitter, sending the new period up to the parent component
   */
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
  @Input() validAccessPeriods$: Observable<string[]>;

  /**
   * The selected access period, e.g. +7DAYS, +12MONTHS, FOREVER. These will be
   * calculated as a timestamp to store as the access expiry date for the requested item
   */
  accessPeriod = 'FOREVER';

  /**
   * Destroy subject for unsubscribing from observables
   * @private
   */
  private destroy$ = new Subject<void>();

  protected readonly hasValue = hasValue;

  constructor(protected location: Location) {
  }

  /**
   * Initialise subscription to async valid access periods (from configuration service)
   */
  ngOnInit(): void {
    this.validAccessPeriods$.pipe(
      takeUntil(this.destroy$),
    ).subscribe((validAccessPeriods) => {
      if (hasValue(validAccessPeriods) && validAccessPeriods.length > 0) {
        this.selectAccessPeriod(validAccessPeriods[0]);
      }
    });
  }

  /**
   * Clean up subscriptions and selectors
   */
  ngOnDestroy(): void {
    this.selectedAccessPeriod.complete();
    this.destroy$.next();
    this.destroy$.complete();
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
