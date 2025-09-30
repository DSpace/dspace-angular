import {
  DOCUMENT,
  NgClass,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import {
  FormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormLayoutService,
  DynamicFormValidationService,
} from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';
import isEqual from 'lodash/isEqual';

import { BtnDisabledDirective } from '../../../../../btn-disabled.directive';
import { hasValue } from '../../../../../empty.util';
import { NumberPickerComponent } from '../../../../number-picker/number-picker.component';
import { DynamicDsDatePickerModel } from './date-picker.model';

export type DatePickerFieldType = '_year' | '_month' | '_day';

export const DS_DATE_PICKER_SEPARATOR = '-';

@Component({
  selector: 'ds-date-picker',
  styleUrls: ['./date-picker.component.scss'],
  templateUrl: './date-picker.component.html',
  imports: [
    BtnDisabledDirective,
    FormsModule,
    NgClass,
    NumberPickerComponent,
    TranslateModule,
  ],
  standalone: true,
})

export class DsDatePickerComponent extends DynamicFormControlComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: UntypedFormGroup;
  @Input() model: DynamicDsDatePickerModel;
  @Input() legend: string;

  @Output() selected = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();
  @Output() blur = new EventEmitter<any>();
  @Output() change = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();

  initialYear: number;
  initialMonth: number;
  initialDay: number;

  year: any;
  month: any;
  day: any;

  minYear: 0;
  maxYear: number;
  minMonth = 1;
  maxMonth = 12;
  minDay = 1;
  maxDay = 31;

  disabledMonth = true;
  disabledDay = true;

  private readonly fields: DatePickerFieldType[] = ['_year', '_month', '_day'];

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              private renderer: Renderer2,
              @Inject(DOCUMENT) private _document: Document,
  ) {
    super(layoutService, validationService);
  }

  ngOnInit() {
    const now = new Date();
    this.initialYear = now.getUTCFullYear();
    this.initialMonth = now.getUTCMonth() + 1;
    this.initialDay = now.getUTCDate();

    if (this.model && this.model.value !== null) {
      // todo: model value could object or Date according to its type annotation
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const values = this.model.value.toString().split(DS_DATE_PICKER_SEPARATOR);
      if (values.length > 0) {
        this.initialYear = parseInt(values[0], 10);
        this.year = this.initialYear;
        this.disabledMonth = false;
      }
      if (values.length > 1) {
        this.initialMonth = parseInt(values[1], 10);
        this.month = this.initialMonth;
        this.disabledDay = false;
      }
      if (values.length > 2) {
        this.initialDay = parseInt(values[2], 10);
        this.day = this.initialDay;
      }
    }

    this.maxYear = now.getUTCFullYear() + 100;
  }

  onBlur(event) {
    this.blur.emit();
  }

  onChange(event) {
    // update year-month-day
    switch (event.field) {
      case 'year': {
        if (event.value !== null) {
          this.year = event.value;
        } else {
          this.year = undefined;
          this.month = undefined;
          this.day = undefined;
          this.disabledMonth = true;
          this.disabledDay = true;
        }
        break;
      }
      case 'month': {
        if (event.value !== null) {
          this.month = event.value;
        } else {
          this.month = undefined;
          this.day = undefined;
          this.disabledDay = true;
        }
        break;
      }
      case 'day': {
        if (event.value !== null) {
          this.day = event.value;
        } else {
          this.day = undefined;
        }
        break;
      }
    }

    // set max for days by month/year
    if (!this.disabledDay) {
      const month = this.month ? this.month - 1 : 0;
      const date = new Date(this.year, month, 1);
      this.maxDay = this.getLastDay(date);
      if (this.day > this.maxDay) {
        this.day = this.maxDay;
      }
    }

    // Manage disable
    if (hasValue(this.year) && event.field === 'year') {
      this.disabledMonth = false;
    } else if (hasValue(this.month) && event.field === 'month') {
      this.disabledDay = false;
    }

    // update value
    let value = null;
    if (hasValue(this.year)) {
      let yyyy = this.year.toString();
      while (yyyy.length < 4) {
        yyyy = '0' + yyyy;
      }
      value = yyyy;
    }
    if (hasValue(this.month)) {
      const mm = this.month.toString().length === 1
        ? '0' + this.month.toString()
        : this.month.toString();
      value += DS_DATE_PICKER_SEPARATOR + mm;
    }
    if (hasValue(this.day)) {
      const dd = this.day.toString().length === 1
        ? '0' + this.day.toString()
        : this.day.toString();
      value += DS_DATE_PICKER_SEPARATOR + dd;
    }

    this.model.value = value;
    this.change.emit(value);
  }

  /**
   * Listen to keydown Tab event.
   * Get the active element and blur it, in order to focus the next input field.
   */
  @HostListener('keydown.tab', ['$event'])
  onTabKeydown(event: KeyboardEvent) {
    event.preventDefault();
    const activeElement: Element = this._document.activeElement;
    (activeElement as any).blur();
    const index = this.selectedFieldIndex(activeElement);
    if (index < 0) {
      return;
    }
    const fieldToFocusOn = index + 1;
    if (fieldToFocusOn < this.fields.length) {
      this.focusInput(this.fields[fieldToFocusOn]);
    }
  }

  @HostListener('keydown.shift.tab', ['$event'])
  onShiftTabKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    const activeElement: Element = this._document.activeElement;
    (activeElement as any).blur();
    const index = this.selectedFieldIndex(activeElement);
    const fieldToFocusOn = index - 1;
    if (fieldToFocusOn >= 0) {
      this.focusInput(this.fields[fieldToFocusOn]);
    }
  }

  private selectedFieldIndex(activeElement: Element): number {
    return this.fields.findIndex(field => isEqual(activeElement.id, this.model.id.concat(field)));
  }

  /**
   * Focus the input field for the given type
   * based on the model id.
   * Used to focus the next input field
   * in case of a disabled field.
   * @param type DatePickerFieldType
   */
  focusInput(type: DatePickerFieldType) {
    const field = this._document.getElementById(this.model.id.concat(type));
    if (field) {

      if (hasValue(this.year) && isEqual(type, '_year')) {
        this.disabledMonth = true;
        this.disabledDay = true;
      }
      if (hasValue(this.year) && isEqual(type, '_month')) {
        this.disabledMonth = false;
      } else if (hasValue(this.month) && isEqual(type, '_day')) {
        this.disabledDay = false;
      }
      setTimeout(() => {
        this.renderer.selectRootElement(field).focus();
      }, 100);
    }
  }

  onFocus(event) {
    this.focus.emit(event);
  }

  getLastDay(date: Date) {
    // Last Day of the same month (+1 month, -1 day)
    date.setMonth(date.getMonth() + 1, 0);
    return date.getDate();
  }

}
