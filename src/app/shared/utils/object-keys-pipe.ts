import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'dsObjectKeys'})
export class ObjectKeysPipe implements PipeTransform {
  transform(value, args:string[]): any {
    const keys = [];
    Object.keys(value).forEach((k) => keys.push(k));
    return keys;
  }
}
