import { Component } from '@angular/core';
import { renderStartsWithFor, StartsWithType } from '../starts-with-decorator';
import { StartsWithAbstractComponent } from '../starts-with-abstract.component';
import { hasValue } from '../../empty.util';

/**
 * A switchable component rendering StartsWith options for the type "Date".
 * The options are rendered in a dropdown with an input field (of type number) next to it.
 */
@Component({
  selector: 'ds-starts-with-date',
  styleUrls: ['./starts-with-date.component.scss'],
  templateUrl: './starts-with-date.component.html'
})
@renderStartsWithFor(StartsWithType.date)
export class StartsWithDateComponent extends StartsWithAbstractComponent {

  monthOptions: string[];

  startsWithMonth = 'none';

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
      'december'
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
    this.setStartsWithParam();
  }

  /**
   * Set the startsWithMonth by event
   * @param event
   */
  setStartsWithMonthEvent(event: Event) {
    this.startsWithMonth = (event.target as HTMLInputElement).value;
    this.setStartsWithYearMonth();
    this.setStartsWithParam();
  }

  /**
   * Get startsWith year combined with month;
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
    this.setStartsWithParam();
  }

  /**
   * Get startsWithYear as a number;
   */
  getStartsWithYear() {
    return this.startsWithYear;
  }

  /**
   * Get startsWithMonth as a number;
   */
  getStartsWithMonth() {
    return this.monthOptions.indexOf(this.startsWithMonth);
  }

}
