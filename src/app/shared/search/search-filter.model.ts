/**
 * Represents a search filter
 */
import { hasValue } from '../empty.util';

export class SearchFilter {
  key: string;
  values: string[];
  operator: string;

  constructor(key: string, values: string[], operator?: string) {
    this.key = key;
    this.values = values;
    if (hasValue(operator)) {
      this.operator = operator;
    } else {
      this.operator = 'query';
    }
  }
}
