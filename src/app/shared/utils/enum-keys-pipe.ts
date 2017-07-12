import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dsKeys' })
export class EnumKeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];
    for (const enumMember in value) {
      if (!isNaN(parseInt(enumMember, 10))) {
        keys.push({ key: +enumMember, value: value[enumMember] });
      }
    }
    return keys;
  }
}
