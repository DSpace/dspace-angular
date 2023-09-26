import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dsCompareValues'
})
export class CompareValuesPipe implements PipeTransform {

  transform(receivedValue: string, currentValue: string): unknown {
    if (receivedValue === currentValue) {
      return '<i class="fa fa-check-circle text-success fa-xl" aria-hidden="true"></i>';
    } else {
      return currentValue;
    }
  }
}
