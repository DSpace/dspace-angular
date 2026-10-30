import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  OnDestroy,
  Optional,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { LocaleService } from '@dspace/core/locale/locale.service';
import {
  isValidDate,
  localeDate,
} from '@dspace/shared/utils/date.util';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * A pipe that transforms date strings.
 *
 * Supports two modes:
 * - Default (no argument or 'struct'): converts a date string to an NgbDateStruct for use with ngb-datepicker.
 * - 'locale': formats a date string according to the current locale (async, uses LocaleService).
 *
 * Usage:
 *   {{ dateValue | toDate }}             → NgbDateStruct
 *   {{ dateValue | toDate:'locale' }}    → locale-formatted string (e.g. "August 24, 2020")
 */
@Pipe({
  // eslint-disable-next-line @angular-eslint/pipe-prefix
  name: 'toDate',
  pure: false,
})
export class ToDatePipe implements PipeTransform, OnDestroy {

  private asyncPipe: AsyncPipe;

  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() private localeService: LocaleService,
  ) {
    this.asyncPipe = new AsyncPipe(cdr);
  }

  transform(dateValue: string | null, mode?: 'struct' | 'locale'): NgbDateStruct | string | null {
    if (!dateValue) {
      return null;
    }

    if (mode === 'locale') {
      return this.transformLocale(dateValue);
    }

    return this.transformStruct(dateValue);
  }

  ngOnDestroy(): void {
    this.asyncPipe.ngOnDestroy();
  }

  /**
   * Converts a date string to an NgbDateStruct for ngb-datepicker.
   */
  private transformStruct(dateValue: string): NgbDateStruct {
    const date = new Date(dateValue);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    } as NgbDateStruct;
  }

  /**
   * Formats a date string according to the current locale.
   */
  private transformLocale(dateValue: string): string | null {
    if (!this.localeService) {
      return isValidDate(dateValue) ? localeDate(dateValue) : dateValue;
    }
    const formatted$: Observable<string> = this.localeService.getCurrentLanguageCode().pipe(
      map((locale: string) => (isValidDate(dateValue) ? localeDate(dateValue, locale) : dateValue)),
    );
    return this.asyncPipe.transform(formatted$) as string | null;
  }
}
