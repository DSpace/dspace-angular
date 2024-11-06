import { Pipe, PipeTransform } from '@angular/core';
import orderBy from 'lodash/orderBy';

@Pipe({
  name: 'dsSort'
})
export class SortPipe implements PipeTransform {

  transform(value: any[], column: string = '', order: 'asc' | 'desc' = 'asc'): any[] {
    if (!value || !order) {
      return value;
    }
    if (!column || column === '') {
      if (order === 'asc') {
        return value.sort();
      } else {
        return value.sort().reverse();
      }
    }
    if (value.length <= 1) {
      return value;
    }

    return orderBy(value, [column], [order]);
  }
}
