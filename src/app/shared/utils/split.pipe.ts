import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dsSplit'
})
export class SplitPipe implements PipeTransform {

  transform(value: string, separator: string): string[] {
    return value.split(separator);
  }

}
