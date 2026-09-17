import {
  DOCUMENT,
  isPlatformBrowser,
} from '@angular/common';
import {
  ApplicationRef,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Inject,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  NavigationStart,
  Router,
} from '@angular/router';
import {
  NgbPopover,
  NgbPopoverConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

/**
 * Directive to create a sticky popover using NgbPopover.
 * The popover remains open when the mouse is over its content and closes when the mouse leaves.
 */
@Directive({
  selector: '[dsStickyPopover]',
  standalone:true,
})
export class StickyPopoverDirective extends NgbPopover implements OnInit, OnDestroy {
  /** Template for the sticky popover content */
  @Input() dsStickyPopover: TemplateRef<any>;

  /** Subscriptions to manage router events */
  subs: Subscription[] = [];

  /** Flag to determine if the popover can be closed */
  private canClosePopover: boolean;

  /** Reference to the element the directive is applied to */
  private readonly _elRef;

  /** Renderer to listen to and manipulate DOM elements */
  private readonly _render;

  /** Reference to the document object (works in both browser and SSR) */
  private readonly document: Document;

  /** Platform identifier to check if running in browser */
  private readonly isBrowser: boolean;

  /** Reference to the popover element */
  private popoverElement: HTMLElement | null = null;

  constructor(
    _elementRef: ElementRef<HTMLElement>,
    _renderer: Renderer2, injector: Injector,
    viewContainerRef: ViewContainerRef,
    config: NgbPopoverConfig,
    _ngZone: NgZone,
    @Inject(DOCUMENT) _document: Document,
    _changeDetector: ChangeDetectorRef,
    applicationRef: ApplicationRef,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    super(_elementRef, _renderer, injector, viewContainerRef, config, _ngZone, _document, _changeDetector, applicationRef);
    this._elRef = _elementRef;
    this._render = _renderer;
    this.document = _document;
    this.isBrowser = isPlatformBrowser(platformId);
    this.triggers = 'manual';
    this.container = 'body';
  }

  /**
   * Sets up event listeners for mouse enter, mouse leave, and click events.
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.ngbPopover = this.dsStickyPopover;

    // Only set up event listeners in browser environment
    if (!this.isBrowser) {
      return;
    }

    this._render.listen(this._elRef.nativeElement, 'mouseenter', () => {
      this.canClosePopover = true;
      this.open();
    });

    this._render.listen(this._elRef.nativeElement, 'mouseleave', () => {
      setTimeout(() => {
        if (this.canClosePopover) {
          this.close();
        }
      }, this.closeDelay ?? 100);
    });

    this._render.listen(this._elRef.nativeElement, 'click', () => {
      this.close();
    });

    this.subs.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          // Immediately hide the popover to prevent it from jumping to the corner
          if (this.popoverElement) {
            this._render.setStyle(this.popoverElement, 'display', 'none');
          }
          this.close();
        }
      }),
    );
  }

  /**
   * Opens the popover and sets up event listeners for mouse over and mouse out events on the popover.
   */
  open() {
    super.open();

    // Only access DOM in browser environment
    if (!this.isBrowser) {
      return;
    }

    // Store reference to the popover element after it's created
    this.popoverElement = this.document.querySelector('.popover') as HTMLElement;

    if (this.popoverElement) {
      this._render.listen(this.popoverElement, 'mouseover', () => {
        this.canClosePopover = false;
      });

      this._render.listen(this.popoverElement, 'mouseout', () => {
        this.canClosePopover = true;
        setTimeout(() => {
          if (this.canClosePopover) {
            this.close();
          }
        }, this.closeDelay ?? 0);
      });
    }
  }

  /**
   * Closes the popover and clears the element reference.
   */
  override close(): void {
    super.close();
    this.popoverElement = null;
  }

  /**
   * Unsubscribes from all subscriptions when the directive is destroyed.
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
