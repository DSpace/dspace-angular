import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[dsRenderOnlyForBrowser]',
  standalone: true,
})
/**
 * Structural Directive for rendering a template reference on client side only
 */
export class BrowserOnlyDirective implements OnChanges {

  @Input() dsRenderOnlyForBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private viewContainer: ViewContainerRef,
    private changeDetector: ChangeDetectorRef,
    private templateRef: TemplateRef<any>,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dsRenderOnlyForBrowser.firstChange && changes.dsRenderOnlyForBrowser.currentValue) {
      this.showTemplateBlockInView();
    }
  }

  /**
   * Show template in view container according to platform
   */
  private showTemplateBlockInView(): void {
    this.viewContainer.clear();
    if (!this.templateRef) {
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.changeDetector.markForCheck();
    }
  }

}
