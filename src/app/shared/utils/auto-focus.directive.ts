import { Directive, AfterViewInit, ElementRef, Input } from '@angular/core';
import { isNotEmpty } from '../empty.util';

@Directive({
  selector: '[dsAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {

  @Input() autoFocusSelector: string;

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    if (isNotEmpty(this.autoFocusSelector)) {
      return this.el.nativeElement.querySelector(this.autoFocusSelector).focus();

    } else {
      return this.el.nativeElement.focus();
    }
  }
}
