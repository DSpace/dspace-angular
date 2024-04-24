import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  Inject,
  OnInit,
  PLATFORM_ID,
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
export class BrowserOnlyDirective implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) protected platformId: string,
    private viewContainer: ViewContainerRef,
    private changeDetector: ChangeDetectorRef,
    private templateRef: TemplateRef<any>,
  ) {
  }

  ngOnInit(): void {
    this.showTemplateBlockInView();
  }

  /**
   * Show template in view container according to platform
   */
  private showTemplateBlockInView(): void {
    if (!this.templateRef) {
      return;
    }
    this.viewContainer.clear();

    if (isPlatformBrowser(this.platformId)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.changeDetector.markForCheck();
    }
  }

}
