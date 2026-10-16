import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';


/**
 * Directive that restores the rounded corners of the boxes rendered inside the
 * {@link DynamicLayoutMatrixComponent} and removes the duplicate border that would
 * otherwise appear between two adjacent boxes.
 */
@Directive({
  selector: '[dsRoundedDynamicLayoutMatrix]',
  standalone: true,
})
export class RoundedDynamicLayoutMatrixDirective implements AfterViewInit {

  private readonly LAYOUT_ROUNDED_TOP = 'layout-rounded-top';
  private readonly LAYOUT_ROUNDED_BOTTOM = 'layout-rounded-bottom';
  private readonly LAYOUT_CONNECTED_BOTTOM = 'layout-connected-bottom';

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.updateRoundedCorners();
  }

  /**
   * Evaluate the current element and its siblings and apply the rounded/connected
   * classes accordingly.
   */
  updateRoundedCorners(): void {
    const element: HTMLElement = this.elementRef.nativeElement;
    const previous: Element | null = this.getVisibleSibling(element, 'previousElementSibling');
    const next: Element | null = this.getVisibleSibling(element, 'nextElementSibling');

    const hasOwnMarginTop: boolean = this.hasMarginTop(element);
    const hasOwnMarginBottom: boolean = this.hasMarginBottom(element);
    const previousHasMarginBottom: boolean = this.hasMarginBottom(previous);
    const nextHasMarginTop: boolean = this.hasMarginTop(next);

    const separatedFromPrevious: boolean = hasOwnMarginTop || previousHasMarginBottom;
    const separatedFromNext: boolean = hasOwnMarginBottom || nextHasMarginTop;

    this.toggleClass(element, this.LAYOUT_ROUNDED_TOP, !previous || separatedFromPrevious);

    this.toggleClass(element, this.LAYOUT_ROUNDED_BOTTOM, !next || separatedFromNext);

    this.toggleClass(element, this.LAYOUT_CONNECTED_BOTTOM, !!next && !separatedFromNext);
  }

  /**
   * Return the nearest sibling in the given direction that actually renders content.
   */
  private getVisibleSibling(
    element: Element,
    direction: 'previousElementSibling' | 'nextElementSibling',
  ): Element | null {
    let sibling: Element | null = element[direction];
    while (sibling && !this.isVisible(sibling)) {
      sibling = sibling[direction];
    }
    return sibling;
  }

  /**
   * Whether the element renders a visible box.
   */
  private isVisible(element: Element): boolean {
    if (!(element instanceof HTMLElement)) {
      return true;
    }
    if (element.offsetWidth > 0 || element.offsetHeight > 0) {
      return true;
    }
    return typeof element.getClientRects === 'function' && element.getClientRects().length > 0;
  }

  /**
   * Whether the given element has a non-zero bottom margin.
   */
  private hasMarginBottom(element: Element | null): boolean {
    return this.getMargin(element, 'marginBottom') > 0;
  }

  /**
   * Whether the given element has a non-zero top margin.
   */
  private hasMarginTop(element: Element | null): boolean {
    return this.getMargin(element, 'marginTop') > 0;
  }

  /**
   * Read the computed value (in pixels) of the given margin property for an element.
   * Returns 0 when the element is null or the value cannot be resolved.
   */
  private getMargin(element: Element | null, property: 'marginTop' | 'marginBottom'): number {
    if (!element || typeof getComputedStyle !== 'function') {
      return 0;
    }
    const value: string = getComputedStyle(element)[property];
    const parsed: number = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  /**
   * Add or remove a class on the element depending on the given condition.
   */
  private toggleClass(element: HTMLElement, className: string, condition: boolean): void {
    if (condition) {
      this.renderer.addClass(element, className);
    } else {
      this.renderer.removeClass(element, className);
    }
  }

}
