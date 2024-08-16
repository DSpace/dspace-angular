import {
  ElementRef,
  Directive,
  Input,
  TemplateRef,
  Renderer2,
  OnInit,
  OnDestroy,
  Injector,
  ViewContainerRef,
  NgZone,
  ChangeDetectorRef,
  ApplicationRef, Inject
} from '@angular/core';
import {NgbPopover, NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
import {DOCUMENT} from '@angular/common';
import {NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs';

/**
 * Directive to create a sticky popover using NgbPopover.
 * The popover remains open when the mouse is over its content and closes when the mouse leaves.
 */
@Directive({
  selector: '[dsStickyPopover]'
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

  constructor(
    _elementRef: ElementRef<HTMLElement>,
    _renderer: Renderer2, injector: Injector,
    viewContainerRef: ViewContainerRef,
    config: NgbPopoverConfig,
    _ngZone: NgZone,
    @Inject(DOCUMENT) _document: Document,
    _changeDetector: ChangeDetectorRef,
    applicationRef: ApplicationRef,
    private router: Router
  ) {
    super(_elementRef, _renderer, injector, viewContainerRef, config, _ngZone, document, _changeDetector, applicationRef);
    this._elRef = _elementRef;
    this._render = _renderer;
    this.triggers = 'manual';
    this.container = 'body';
  }

  /**
   * Sets up event listeners for mouse enter, mouse leave, and click events.
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.ngbPopover = this.dsStickyPopover;

    this._render.listen(this._elRef.nativeElement, 'mouseenter', () => {
      this.canClosePopover = true;
      this.open();
    });

    this._render.listen(this._elRef.nativeElement, 'mouseleave', () => {
      setTimeout(() => {
        if (this.canClosePopover) {
          this.close();
        }
      }, 100);
    });

    this._render.listen(this._elRef.nativeElement, 'click', () => {
      this.close();
    });

    this.subs.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.close();
        }
      })
    );
  }

  /**
   * Opens the popover and sets up event listeners for mouse over and mouse out events on the popover.
   */
  open() {
    super.open();
    const popover = window.document.querySelector('.popover');
    this._render.listen(popover, 'mouseover', () => {
      this.canClosePopover = false;
    });

    this._render.listen(popover, 'mouseout', () => {
      this.canClosePopover = true;
      setTimeout(() => {
        if (this.canClosePopover) {
          this.close();
        }
      }, 0);
    });
  }

  /**
   * Unsubscribes from all subscriptions when the directive is destroyed.
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
