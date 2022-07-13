import { DuplicateDecisionType } from './duplicate-decision-type';
import { DuplicateDecisionValue } from './duplicate-decision-value';
import { isNotNull } from '../../../../shared/empty.util';

export class DuplicateDecision {

  private _value: DuplicateDecisionValue;
  private _type: DuplicateDecisionType;
  private _note: string;
  private _date: any;

  public constructor(value = null, type = null, note = null) {
    if (isNotNull(value)) {
      this.value = value;
    }

    if (isNotNull(type)) {
      this.type = type;
    }

    if (isNotNull(note)) {
      this.note = note;
    }
  }

  get value(): DuplicateDecisionValue {
    return this._value;
  }

  set value(value: DuplicateDecisionValue) {
    this._value = value;
  }

  get type(): DuplicateDecisionType {
    return this._type;
  }

  set type(value: DuplicateDecisionType) {
    this._type = value;
  }

  get date(): any {
    return this._date;
  }

  set date(value: any) {
    this._date = value;
  }

  get note(): string {
    return this._note;
  }

  set note(value: string) {
    this._note = value;
  }
}
