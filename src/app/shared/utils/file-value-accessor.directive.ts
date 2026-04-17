import { Directive } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[type=file]',
  host: {
    '(change)': 'onChange($event.target.files)',
    '(blur)': 'onTouched()',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: FileValueAccessorDirective, multi: true },
  ],
})
/**
 * Value accessor directive for inputs of type 'file'
 */
export class FileValueAccessorDirective implements ControlValueAccessor {
  value: any;
  onChange = (_) => { /* empty */ };
  onTouched = () => { /* empty */};

  writeValue(value) { /* empty */}
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
}
