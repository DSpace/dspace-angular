import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

/**
 * Directive to detect when the user hovers outside the element the directive was put on
 *
 * **Performance Consideration**: it's probably not good for performance to use this excessively (on
 * {@link ExpandableNavbarSectionComponent} for example, a workaround for this problem was to add an `*ngIf` to prevent
 * this Directive from always being active)
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
   * CSS selector for the parent element to monitor. If set, the directive will use this
   * selector to determine if the hover event originated within the selected parent element.
   * If left unset, the directive will monitor mouseover hover events for the element it is applied to.
   */
  @Input()
  public dsHoverOutsideOfParentSelector: string;

  constructor(
    private elementRef: ElementRef,
  ) {
  }

  @HostListener('document:mouseover', ['$event'])
  public onMouseOver(event: MouseEvent): void {
    const targetElement: HTMLElement = event.target as HTMLElement;
    const element: Element = document.querySelector(this.dsHoverOutsideOfParentSelector);
    const hoveredInside = (element ? new ElementRef(element) : this.elementRef).nativeElement.contains(targetElement);

    if (!hoveredInside) {
      this.dsHoverOutside.emit(null);
    }
  }

}
