import { Directive, ElementRef, Inject, Input, OnDestroy } from '@angular/core';
import { default as shave } from 'shave';
import { NativeWindowRef, NativeWindowService } from '../window.service';
import { Observable } from 'rxjs/Observable';

@Directive({
  selector: '[dsShave]'
})
export class ShaveDirective implements OnDestroy {
  @Input() shave: IShaveOptions = {};
  @Input() shaveHeight: 100;
  private sub;

  constructor(private ele: ElementRef, @Inject(NativeWindowService) private _window: NativeWindowRef) {
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
