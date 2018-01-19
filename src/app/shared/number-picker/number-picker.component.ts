import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ds-number-picker',
  styleUrls: ['./number-picker.component.scss'],
  templateUrl: './number-picker.component.html',
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: NumberPickerComponent, multi: true}
  ],
})

export class NumberPickerComponent implements OnInit, ControlValueAccessor {
  @Output()
  selected = new EventEmitter<number>();
  @Output()
  remove = new EventEmitter<number>();
  @Output()
  change = new EventEmitter<any>();

  @Input()
  step: number;
  @Input()
  min: number;
  @Input()
  max: number;
  @Input()
  size: number;
  @Input()
  placeholder: string;
  @Input()
  name: string;
  @Input()
  disabled: boolean;
  @Input()
  value: number;
  lastValue: number;

  // hiddenForm: FormGroup;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    // this.lastValue = this.value;
    this.step = this.step || 1;
    this.min = this.min || 0;
    this.max = this.max || 100;
    this.disabled = this.disabled || false;
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.value) {
      if (changes.max) {
        // When the user select a month with < # of days
        this.value = this.value > this.max ? this.max : this.value;
      }

    } else if (changes.value && changes.value.currentValue === null) {
      // When the user delete the inserted value
        this.value = null;
    }
  }

  increment(reverse?: boolean) {
    // First after init
    if (!this.value) {
      this.value = this.lastValue;
    } else {
      this.lastValue = this.value;

      let newValue = this.value;
      if (reverse) {
        newValue -= this.step;
      } else {
        newValue += this.step;
      }

      if (newValue >= this.min && newValue <= this.max) {
        this.value = newValue;
      } else {
        if (newValue > this.max) {
          this.value = this.min;
        } else {
          this.value = this.max;
        }
      }
    }

    this.emitChange();
  }

  decrement() {
    this.increment(true);
  }

  update(event) {
    try {
      console.log(event);
      const i = Number.parseInt(event.target.value);
      // console.log(i);

      if (i >= this.min && i <= this.max) {
        this.value = i;
        this.emitChange();
      } else if (event.target.value === null || event.target.value === '') {
        this.value = null;
        this.emitChange();
      } else {
        this.value = this.lastValue;
      }
    } catch (e) {

      this.value = this.lastValue;
      console.log('Catch Not a number...');

    }
  }

  onFocus() {
    if (this.value) {
      this.lastValue = this.value;
    }
  }

  writeValue(value) {
    if (this.lastValue) {
      this.lastValue = this.value;
      this.value = value;
    } else {
      // First init
      this.lastValue = value;
    }
  }

  registerOnChange(fn) {
    // this.change = fn;
  }

  registerOnTouched(fn) {
  }

  emitChange() {
    this.change.emit({field: this.name, value: this.value});
  }
}
