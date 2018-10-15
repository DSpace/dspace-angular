import { Directive, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Directive({
  selector: '[ngModel][dsDebounce]',
})
/**
 * Directive for setting a debounce time on an input field
 * It will emit the input field's value when no changes were made to this value in a given debounce time
 */
export class DebounceDirective implements OnInit, OnDestroy {

  /**
   * Emits a value when nothing has changed in dsDebounce milliseconds
   */
  @Output()
  public onDebounce = new EventEmitter<any>();

  /**
   * The debounce time in milliseconds
   */
  @Input()
  public dsDebounce = 500;

  /**
   * True if no changes have been made to the input field's value
   */
  private isFirstChange = true;

  /**
   * Subject to unsubscribe from
   */
  private subject: Subject<void> = new Subject<void>();

  constructor(public model: NgControl) {
  }

  /**
   * Start listening to changes of the input field's value changes
   * Emit it when the debounceTime is over without new changes
   */
  ngOnInit() {
    this.model.valueChanges
      .takeUntil(this.subject)
      .debounceTime(this.dsDebounce)
      .distinctUntilChanged()
      .subscribe((modelValue) => {
        if (this.isFirstChange) {
          this.isFirstChange = false;
        } else {
          this.onDebounce.emit(modelValue);
        }
      });
  }

  /**
   * Close subject
   */
  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }
}
