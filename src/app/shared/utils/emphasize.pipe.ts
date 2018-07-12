import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dsEmphasize' })
export class EmphasizePipe implements PipeTransform {
  specials = [
    // order matters for these
    '-'
    , '['
    , ']'
    // order doesn't matter for any of these
    , '/'
    , '{'
    , '}'
    , '('
    , ')'
    , '*'
    , '+'
    , '?'
    , '.'
    , '\\'
    , '^'
    , '$'
    , '|'
  ];
  regex = RegExp('[' + this.specials.join('\\') + ']', 'g');

  transform(haystack, needle): any {
    const escaped = this.escapeRegExp(needle);
    const reg = new RegExp(escaped, 'gi');
    return haystack.replace(reg, '<em>$&</em>');
  }

   escapeRegExp(str) {
    return str.replace(this.regex, '\\$&');
  }
}
