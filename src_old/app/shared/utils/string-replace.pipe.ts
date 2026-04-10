import {
  Pipe,
  PipeTransform,
} from '@angular/core';
import { hasValue } from '@dspace/shared/utils/empty.util';


@Pipe({
  name: 'dsStringReplace',
  standalone: true,
})
export class StringReplacePipe implements PipeTransform {

  transform(value: string, regexValue: string, replaceValue: string): string {
    const regex = new RegExp(regexValue, 'g');
    return hasValue(value) ? value.replace(regex, replaceValue) : value;
  }
}
