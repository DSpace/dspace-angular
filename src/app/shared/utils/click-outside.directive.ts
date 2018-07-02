import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
  selector: '[dsClickOutside]'
})
export class ClickOutsideDirective {
  constructor(private _elementRef: ElementRef) {
  }

  @Output()
  public dsClickOutside = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.dsClickOutside.emit(null);
    }
  }
}
