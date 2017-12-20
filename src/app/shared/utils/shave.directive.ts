import {
  Directive, ElementRef, Inject, Input, OnChanges, OnDestroy,
  OnInit
} from '@angular/core';
import { default as shave } from 'shave';
import { NativeWindowRef, NativeWindowService } from '../window.service';
import { Observable } from 'rxjs/Observable';

@Directive({
  selector: '[dsShave]'
})
export class ShaveDirective implements OnDestroy, OnChanges {

  @Input() shave: IShaveOptions = {};

  @Input()
  set shaveHeight(value) {
    if (value > 0) {
      console.log(value);
      this._shaveHeight = value;
    }
  };

  get shaveHeight() {
    return this._shaveHeight;
  }

  private _shaveHeight = 72;
  private sub;

  constructor(private ele: ElementRef, @Inject(NativeWindowService) private _window: NativeWindowRef) {
  }

  ngOnChanges(): void {
    if (this.shaveHeight > 0) {
      this.runShave();
    }
    this.subscribeForResizeEvent();
  }

  subscribeForResizeEvent() {
    const obs = Observable.fromEvent(this._window.nativeWindow, 'resize');
    this.sub = obs.subscribe((e) => this.runShave());
  }

  private runShave() {
    shave(this.ele.nativeElement, this.shaveHeight, this.shave);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
