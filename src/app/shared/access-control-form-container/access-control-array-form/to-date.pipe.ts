import {
  Pipe,
  PipeTransform,
} from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-struct';

@Pipe({
  // eslint-disable-next-line @angular-eslint/pipe-prefix
  name: 'toDate',
  pure: false,
  standalone: true,
})
export class ToDatePipe implements PipeTransform {
  transform(dateValue: string | null): NgbDateStruct | null {
    if (!dateValue) {
      return null;
    }

    const date = new Date(dateValue);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    } as NgbDateStruct;
  }

}
