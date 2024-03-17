import {
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';

import { ContextHelpService } from './context-help.service';
import { ContextHelpWrapperComponent } from './context-help-wrapper/context-help-wrapper.component';
import { PlacementDir } from './context-help-wrapper/placement-dir.model';
import { hasValue } from './empty.util';

export interface ContextHelpDirectiveInput {
  content: string;
  id: string;
  tooltipPlacement?: PlacementArray;
  iconPlacement?: PlacementDir;
}

/**
 * Directive to add a clickable tooltip icon to an element.
 * The tooltip icon's position is configurable ('left' or 'right')
 * and so is the position of the tooltip itself (PlacementArray).
 */
@Directive({
  selector: '[dsContextHelp]',
  standalone: true,
})
export class ContextHelpDirective implements OnChanges, OnDestroy {
  /**
   * Expects an object with the following fields:
   * - content: a string referring to an entry in the i18n files
   * - tooltipPlacement: a PlacementArray describing where the tooltip should expand, relative to the tooltip icon
   * - iconPlacement: a string 'left' or 'right', describing where the tooltip icon should be placed, relative to the element
   */
  @Input() dsContextHelp: ContextHelpDirectiveInput;
  mostRecentId: string | undefined = undefined;

  protected wrapper: ComponentRef<ContextHelpWrapperComponent>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private contextHelpService: ContextHelpService,
  ) {}

  ngOnChanges() {
    this.clearMostRecentId();
    this.mostRecentId = this.dsContextHelp.id;
    this.contextHelpService.add({ id: this.dsContextHelp.id, isTooltipVisible: false });

    if (this.wrapper === undefined) {
      this.wrapper = this.viewContainerRef.createComponent(ContextHelpWrapperComponent);
    }
    this.wrapper.setInput('templateRef', this.templateRef);
    this.wrapper.setInput('content', this.dsContextHelp.content);
    this.wrapper.setInput('id', this.dsContextHelp.id);
    this.wrapper.setInput('tooltipPlacement', this.dsContextHelp.tooltipPlacement);
    this.wrapper.setInput('iconPlacement', this.dsContextHelp.iconPlacement);
  }

  ngOnDestroy() {
    this.clearMostRecentId();
    if (hasValue(this.wrapper)) {
      this.wrapper.destroy();
      this.wrapper = undefined;
    }
  }

  private clearMostRecentId(): void {
    if (this.mostRecentId !== undefined) {
      this.contextHelpService.remove(this.mostRecentId);
    }
  }
}
