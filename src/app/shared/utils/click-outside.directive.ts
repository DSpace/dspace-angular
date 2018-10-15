import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[dsClickOutside]'
})
/**
 * Directive to detect when the users clicks outside of the element the directive was put on
 */
export class ClickOutsideDirective {
  /**
   * Emits null when the user clicks outside of the element
   */
  @Output()
  public dsClickOutside = new EventEmitter();

  constructor(private _elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.dsClickOutside.emit(null);
    }
  }
}
