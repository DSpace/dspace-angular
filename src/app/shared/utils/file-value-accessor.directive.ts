import {Directive} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: 'input[type=file]',
    // tslint:disable-next-line:no-host-metadata-property
    host : {
        '(change)' : 'onChange($event.target.files)',
        '(blur)': 'onTouched()'
    },
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: FileValueAccessorDirective, multi: true }
    ]
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
