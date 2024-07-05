import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

/**
 * Directive to detect when the user hovers outside of the element the directive was put on
 *
 * BEWARE: it's probably not good for performance to use this excessively (on {@link ExpandableNavbarSectionComponent}
 * for example, a workaround for this problem was to add an `*ngIf` to prevent this Directive from always being active)
 */
@Directive({
  selector: '[dsHoverOutside]',
  standalone: true,
})
export class HoverOutsideDirective {

  /**
   * Emits null when the user hovers outside of the element
   */
  @Output()
  public dsHoverOutside = new EventEmitter();

  /**
   * The {@link ElementRef} for which this directive should emit when the mouse leaves it. By default this will be the
   * element the directive was put on.
   */
  @Input()
  public dsHoverOutsideOfElement: ElementRef;

  constructor(
    private elementRef: ElementRef,
  ) {
    this.dsHoverOutsideOfElement = this.elementRef;
  }

  @HostListener('document:mouseover', ['$event'])
  public onMouseOver(event: MouseEvent): void {
    const targetElement: HTMLElement = event.target as HTMLElement;
    const hoveredInside = this.dsHoverOutsideOfElement.nativeElement.contains(targetElement);

    if (!hoveredInside) {
      this.dsHoverOutside.emit(null);
    }
  }

}
