import { NgFor } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { hasValue } from '../../empty.util';
import { StartsWithAbstractComponent } from '../starts-with-abstract.component';

/**
 * A switchable component rendering StartsWith options for the type "Date".
 * The options are rendered in a dropdown with an input field (of type number) next to it.
 */
@Component({
  selector: 'ds-starts-with-date',
  styleUrls: ['./starts-with-date.component.scss'],
  templateUrl: './starts-with-date.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, TranslateModule],
})
export class StartsWithDateComponent extends StartsWithAbstractComponent implements OnInit {

  /**
   * A list of options for months to select from
   */
  monthOptions: string[];

  /**
   * Currently selected month
   */
  startsWithMonth = 'none';

  /**
   * Currently selected year
   */
  startsWithYear: number;

  ngOnInit() {
    this.monthOptions = [
      'none',
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];

    super.ngOnInit();
  }

  /**
   * Set the startsWith by event
   * @param event
   */
  setStartsWithYearEvent(event: Event) {
    this.startsWithYear = +(event.target as HTMLInputElement).value;
    this.setStartsWithYearMonth();
    this.setStartsWithParam(true);
  }

  /**
   * Set the startsWithMonth by event
   * @param event
   */
  setStartsWithMonthEvent(event: Event) {
    this.startsWithMonth = (event.target as HTMLInputElement).value;
    this.setStartsWithYearMonth();
    this.setStartsWithParam(true);
  }

  /**
   * Get startsWith year combined with month;
   * Returned value: "{{year}}-{{month}}"
   */
  getStartsWith() {
    const month = this.getStartsWithMonth();
    if (month > 0 && hasValue(this.startsWithYear) && this.startsWithYear !== -1) {
      let twoDigitMonth = '' + month;
      if (month < 10) {
        twoDigitMonth = `0${month}`;
      }
      return `${this.startsWithYear}-${twoDigitMonth}`;
    } else {
      if (hasValue(this.startsWithYear) && this.startsWithYear > 0) {
        return '' + this.startsWithYear;
      } else {
        return undefined;
      }
    }
  }

  /**
   * Set startsWith year combined with month;
   */
  setStartsWithYearMonth() {
    this.startsWith = this.getStartsWith();
  }

  /**
   * Set the startsWith by string
   * This method also sets startsWithYear and startsWithMonth correctly depending on the received value
   * - When startsWith contains a "-", the first part is considered the year, the second part the month
   * - When startsWith doesn't contain a "-", the whole string is expected to be the year
   * startsWithMonth will be set depending on the index received after the "-"
   * @param startsWith
   */
  setStartsWith(startsWith: string) {
    this.startsWith = startsWith;
    if (hasValue(startsWith) && startsWith.indexOf('-') > -1) {
      const split = startsWith.split('-');
      this.startsWithYear = +split[0];
      const month = +split[1];
      if (month < this.monthOptions.length) {
        this.startsWithMonth = this.monthOptions[month];
      } else {
        this.startsWithMonth = this.monthOptions[0];
      }
    } else {
      this.startsWithYear = +startsWith;
    }
  }

  /**
   * Get startsWithMonth as a number;
   */
  getStartsWithMonth() {
    return this.monthOptions.indexOf(this.startsWithMonth);
  }

}
