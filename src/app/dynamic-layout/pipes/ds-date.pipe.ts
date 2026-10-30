import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  isValidDate,
  localeDate,
} from '@dspace/shared/utils/date.util';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocaleService } from '../../core/locale/locale.service';

@Pipe({
  name: 'dsDate',
  pure: true,
})
export class DsDatePipe implements PipeTransform, OnDestroy {

  private asyncPipe: AsyncPipe;

  constructor(
    cdr: ChangeDetectorRef,
    private localeService: LocaleService,
  ) {
    this.asyncPipe = new AsyncPipe(cdr);
  }

  transform(value: string): string | null {
    const formatted$: Observable<string> = this.localeService.getCurrentLanguageCode().pipe(
      map((locale: string) => (isValidDate(value) ? localeDate(value, locale) : value)),
    );
    return this.asyncPipe.transform(formatted$) as string | null;
  }

  ngOnDestroy(): void {
    this.asyncPipe.ngOnDestroy();
  }
}
