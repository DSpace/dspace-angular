
import { NativeWindowRef, NativeWindowService } from '../window.service';
import { Observable } from 'rxjs/Observable';
import { AfterViewInit, Directive, ElementRef, Inject } from '@angular/core';

@Directive({
  selector: '[dsStick]'
})
export class ScrollAndStickDirective implements AfterViewInit {

  private initialY: number;

  constructor(private _element: ElementRef, @Inject(NativeWindowService) private _window: NativeWindowRef) {
    this.subscribeForScrollEvent();
  }

  ngAfterViewInit(): void {
    this.initialY = this._element.nativeElement.getBoundingClientRect().top;
  }

  subscribeForScrollEvent() {

    const obs = Observable.fromEvent(window, 'scroll');

    obs.subscribe((e) => this.handleScrollEvent(e));
  }

  handleScrollEvent(e) {

    if (this._window.nativeWindow.pageYOffset >= this.initialY) {

      this._element.nativeElement.classList.add('stick');

    } else {

      this._element.nativeElement.classList.remove('stick');

    }
  }
}
