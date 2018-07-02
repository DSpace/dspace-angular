import { Directive, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Directive({
  selector: '[ngModel][dsDebounce]',
})
export class DebounceDirective implements OnInit, OnDestroy {
  @Output()
  public onDebounce = new EventEmitter<any>();

  @Input('dsDebounce')
  public debounceTime = 500;

  private isFirstChange = true;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public model: NgControl) {
  }

  ngOnInit() {
    this.model.valueChanges
      .takeUntil(this.ngUnsubscribe)
      .debounceTime(this.debounceTime)
      .distinctUntilChanged()
      .subscribe((modelValue) => {
        if (this.isFirstChange) {
          this.isFirstChange = false;
        } else {
          this.onDebounce.emit(modelValue);
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}