import { AfterContentChecked, Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { TruncatableService } from '../truncatable.service';
import { hasValue } from '../../empty.util';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NativeWindowRef, NativeWindowService } from '../../../core/services/window.service';

@Component({
  selector: 'ds-truncatable-part',
  templateUrl: './truncatable-part.component.html',
  styleUrls: ['./truncatable-part.component.scss']
})

/**
 * Component that truncates/clamps a piece of text
 * It needs a TruncatableComponent parent to identify it's current state
 */
export class TruncatablePartComponent implements AfterContentChecked, OnInit, OnDestroy {
  /**
   * Number of lines shown when the part is collapsed
   */
  @Input() minLines: number;

  /**
   * Number of lines shown when the part is expanded. -1 indicates no limit
   */
  @Input() maxLines = -1;

  /**
   * The identifier of the parent TruncatableComponent
   */
  @Input() id: string;

  /**
   * Type of text, can be a h4 for headers or any other class you want to add
   */
  @Input() type: string;

  /**
   * True if the minimal height of the part should at least be as high as it's minimum amount of lines
   */
  @Input() fixedHeight = false;

  @Input() background = 'default';

  /**
   * Current amount of lines shown of this part
   */
  lines: string;

  /**
   * Subscription to unsubscribe from
   */
  private sub;
  /**
   * store variable used for local to expand collapse
   */
  expand = false;
  /**
   * variable to check if expandable
   */
  expandable = false;
  /**
   * variable to check if it is a browser
   */
  isBrowser: boolean;
  /**
   * variable which save get observer
   */
  observer;
  /**
   * variable to save content to be observed
   */
  observedContent;

  public constructor(
    private service: TruncatableService,
    @Inject(DOCUMENT) private document: any,
    @Inject(NativeWindowService) private _window: NativeWindowRef,
    @Inject(PLATFORM_ID) platformId: object
    ) {
      this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Initialize lines variable
   */
  ngOnInit() {
    this.setLines();
  }

  /**
   * Subscribe to the current state to determine how much lines should be shown of this part
   */
  private setLines() {
    this.sub = this.service.isCollapsed(this.id).subscribe((collapsed: boolean) => {
      if (collapsed) {
        this.lines = this.minLines.toString();
        this.expand = false;
      } else {
        this.lines = this.maxLines < 0 ? 'none' : this.maxLines.toString();
        this.expand = true;
      }
    });
  }

  ngAfterContentChecked() {
    if (this.isBrowser) {
      if (this.observer && this.observedContent) {
        this.toUnobserve();
      }
      this.toObserve();
    }
  }

  /**
   * Function to get data to be observed
   */
  toObserve() {
    this.observedContent = this.document.querySelectorAll('.content');
    this.observer = new (this._window.nativeWindow as any).ResizeObserver((entries) => {
       for (let entry of entries) {
        if (!entry.target.classList.contains('notruncatable')) {
          if (entry.target.scrollHeight > entry.contentRect.height) {
            if (entry.target.children.length > 0) {
              if (entry.target.children[0].offsetHeight > entry.contentRect.height) {
                entry.target.classList.add('truncated');
              } else {
                entry.target.classList.remove('truncated');
              }
            } else {
              entry.target.classList.add('truncated');
            }
          } else {
            entry.target.classList.remove('truncated');
          }
        }
      }
    });
    this.observedContent.forEach(p => {
      this.observer.observe(p);
    });
  }

  /**
   * Function to remove data which is observed
   */
   toUnobserve() {
    this.observedContent.forEach(p => {
      this.observer.unobserve(p);
    });
   }

  /**
   * Expands the truncatable when it's collapsed, collapses it when it's expanded
   */
  public toggle() {
    this.service.toggle(this.id);
    this.expandable = !this.expandable;
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
    if (this.isBrowser) {
      this.toUnobserve();
    }
  }
}
