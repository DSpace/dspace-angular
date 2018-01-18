import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicDsDatePickerModel } from './ds-date-picker.model';

@Component({
  selector: 'ds-date-picker',
  styleUrls: ['./ds-date-picker.component.scss'],
  templateUrl: './ds-date-picker.component.html',
})

export class DsDatePickerComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicDsDatePickerModel;
  @Input() showErrorMessages = false;
  // @Input()
  // minDate;
  // @Input()
  // maxDate;

  @Output()
  selected = new EventEmitter<number>();
  @Output()
  remove = new EventEmitter<number>();
  @Output()
  change = new EventEmitter<any>();

  initialYear: number;
  initialMonth: number;
  initialDay: number;

  year: number;
  month: number;
  day: number;

  minYear: 0;
  maxYear: number;
  minMonth = 1;
  maxMonth = 12;
  minDay = 1;
  maxDay = 31;

  yearPlaceholder = 'year';
  monthPlaceholder = 'month';
  dayPlaceholder = 'day';

  disabledMonth = true;
  disabledDay = true;

  ngOnInit() {// TODO Manage fields when not setted
    const now = new Date();
    this.initialYear = now.getFullYear();
    this.initialMonth = now.getMonth() + 1;
    this.initialDay = now.getDate();

    if (this.model.value) {
      const values = this.model.value[0].split('-');
      if (values.length > 0) {
        this.initialYear = parseInt(values[0]);
        this.year = this.initialYear;
        this.disabledMonth = false;
      }
      if (values.length > 1) {
        this.initialMonth = parseInt(values[1]);
        this.month = this.initialMonth;
        this.disabledDay = false;
      }
      if (values.length > 2) {
        this.initialDay = parseInt(values[2]);
        this.day = this.initialDay;
      }
    }

    this.maxYear = this.initialYear + 100;
  }

  onChange(event) {
    // update year-month-day
    switch (event.field) {
      case 'year': {
        this.year = event.value;
        this.manageFebruary();
        break;
      }
      case 'month': {
        this.month = event.value;
        this.manageFebruary();
        break;
      }
      case 'day': {
        this.day = event.value;
        break;
      }
    }

    // set max for days by month/year
    let date = null;
    if (this.month && this.day) {
      date = new Date(this.year, this.month - 1, this.day);
    } else {
      const month = this.month ? this.month - 1 : 0;
      date = new Date(this.year, month);
    }
    if (!this.disabledDay) {
      this.maxDay = this.getLastDay(date.getFullYear(), date.getMonth() + 1);
    }

    // Manage disable
    if (!this.model.value && event.field === 'year') {
      this.disabledMonth = false;
    } else if (this.disabledDay && event.field === 'month') {
      this.disabledDay = false;
    }

    // update value
    let value = date.getFullYear().toString();
    if (this.month) {
      const month = this.month.toString().length === 1
        ? '0' + this.month.toString()
        : this.month.toString();
      value += '-' + month;
    }
    if (this.day) {
      const day = this.day.toString().length === 1
        ? '0' + this.day.toString()
        : this.day.toString();
      value += '-' + day;
    }
    this.model.valueUpdates.next(value);
    this.change.emit(event);


  }

  getLastDay(year, month) {
    const date = new Date(year, month - 1);
    date.setMonth(month, 0);
    return date.getDate();
  }

  manageFebruary() {
    // Case february
    if (this.month === 2 && this.day > 28) {
      if (this.year % 4 > 0) {
        this.day = 28;
      } else {
        this.day = 29;
      }
    }
  }
}
