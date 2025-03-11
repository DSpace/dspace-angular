import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';

import { LocaleService } from '../../core/locale/locale.service';
import {
  isValidDate,
  localeDate,
} from '../../shared/date.util';

@Pipe({
  name: 'dsDate',
  standalone: true,
})
export class DsDatePipe implements PipeTransform, OnDestroy {

  private asyncPipe: AsyncPipe;

  months: Map<number, string>;

  constructor(
    private cdr: ChangeDetectorRef,
    private localeService: LocaleService,
  ) {
    this.asyncPipe = new AsyncPipe(cdr);
  }

  transform(value: string, ...params: any[]): string {
    const locale = this.localeService.getCurrentLanguageCode();
    return isValidDate(value) ? localeDate(value, locale) : value;
  }

  ngOnDestroy() {
    this.asyncPipe.ngOnDestroy();
  }
}
