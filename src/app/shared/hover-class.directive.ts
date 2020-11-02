import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[dsHoverClass]'
})
export class HoverClassDirective {
​
  constructor(public elementRef: ElementRef) { }
  @Input('dsHoverClass') hoverClass: string;
​
  @HostListener('mouseenter') onMouseEnter() {
    this.elementRef.nativeElement.classList.add(this.hoverClass);
  }
​
  @HostListener('mouseleave') onMouseLeave() {
    this.elementRef.nativeElement.classList.remove(this.hoverClass);
  }
​
}
