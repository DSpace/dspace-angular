import {AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-replace-place-dialog',
  templateUrl: './replace-place-dialog.component.html',
  styleUrls: ['./replace-place-dialog.component.scss']
})
export class ReplacePlaceDialogComponent {
  @Output() rightPaneInitlized = new EventEmitter<string>();
  @Output() closePanel = new EventEmitter<boolean>();
  curruntStep = 1;
  totalSteps = 5;
  subModules:any;
  currentvalue:any;
  options:any;
  

  // formGroup: FormGroup;
  
  selectedIndex: number = null;
  constructor(
  ) {
  }

  next(){
    this.curruntStep = this.totalSteps <= this.totalSteps ? this.curruntStep + 1 : this.totalSteps;
  }
  
  previus(){
    this.curruntStep = this.curruntStep != 1 ? this.curruntStep - 1 : 1;
  }
 
    setIndex(value: any) {
      //  this.selectedIndex = index;
      this.currentvalue=value;
      // alert(currentvalue);
    }
    _value: number = 0;
    _step: number = 1;
    _min: number = 0;
    _max: number = Infinity;
    _wrap: boolean = false;

    myFormGroup = new FormGroup({
      formField: new FormControl()
    });
  
  
    @Input('value')
    set inputValue(_value: number) {
      this._value = this.parseNumber(_value);
    }
  
    @Input()
    set step(_step: number) {
      this._step = this.parseNumber(_step);
    }
  
    @Input()
    set min(_min: number) {
      this._min = this.parseNumber(_min);
    }
  
    @Input()
    set max(_max: number) {
      this._max = this.parseNumber(_max);
    }
  
    @Input()
    set wrap(_wrap: boolean) {
      this._wrap = this.parseBoolean(_wrap);
    }
  
    private parseNumber(num: any): number {
      return +num;
    }
  
    private parseBoolean(bool: any): boolean {
      return !!bool;
    }
  
    // setColor(color: string): void {
    //   this.color = color;
    // }
  
    // getColor(): string {
    //   return this.color
    // }
  
    incrementValue(step: number = 1): void {
  
      let inputValue = this._value + step;
  
      if (this._wrap) {
        inputValue = this.wrappedValue(inputValue);
      }
  
      this._value = inputValue;
    }
  
    private wrappedValue(inputValue): number {
      if (inputValue > this._max) {
        return this._min + inputValue - this._max;
      }
  
      if (inputValue < this._min) {
  
        if (this._max === Infinity) {
          return 0;
        }
  
        return this._max + inputValue;
      }
  
      return inputValue;
    }
  
    shouldDisableDecrement(inputValue: number): boolean {
      return !this._wrap && inputValue <= this._min;
    }
  
    shouldDisableIncrement(inputValue: number): boolean {
      return !this._wrap && inputValue >= this._max;
    }

    showDiv = {
      previous : false,
      current : false,
      next : false
    }

    
 ngAfterViewInit(): void {
    this.rightPaneInitlized.emit('');

  }

  close(){
    console.log('Emmited');
    console.log('Emmited');
    this.closePanel.emit(true);
  }

}
