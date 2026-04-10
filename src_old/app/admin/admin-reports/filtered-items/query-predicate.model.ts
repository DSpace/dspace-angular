import {
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';

export class QueryPredicate {

  static EXISTS = 'exists';
  static DOES_NOT_EXIST = 'doesnt_exist';
  static EQUALS = 'equals';
  static DOES_NOT_EQUAL = 'not_equals';
  static LIKE = 'like';
  static NOT_LIKE = 'not_like';
  static CONTAINS = 'contains';
  static DOES_NOT_CONTAIN = 'doesnt_contain';
  static MATCHES = 'matches';
  static DOES_NOT_MATCH = 'doesnt_match';

  field = '*';
  operator: string;
  value: string;

  static of(field: string, operator: string, value: string = '') {
    const pred = new QueryPredicate();
    pred.field = field;
    pred.operator = operator;
    pred.value = value;
    return pred;
  }

  static toString(pred: QueryPredicate): string {
    if (pred.value) {
      return `${pred.field}:${pred.operator}:${pred.value}`;
    }
    return `${pred.field}:${pred.operator}`;
  }

  toFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      field: new FormControl(this.field),
      operator: new FormControl(this.operator),
      value: new FormControl(this.value),
    });
  }

}
