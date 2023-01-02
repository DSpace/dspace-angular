import { ComponentFactoryResolver, ComponentRef, Directive, ElementRef, Input, OnChanges, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { ContextHelpWrapperComponent } from './context-help-wrapper/context-help-wrapper.component';
import { PlacementDir } from './context-help-wrapper/placement-dir.model';

export interface ContextHelpDirectiveInput {
  content: string;
  tooltipPlacement?: PlacementArray;
  iconPlacement?: PlacementDir;
}

/*
 * Directive to add a clickable tooltip icon to an element.
 * The tooltip icon's position is configurable ('left' or 'right')
 * and so is the position of the tooltip itself (PlacementArray).
 */
@Directive({
  selector: '[dsContextHelp]',
})
export class ContextHelpDirective implements OnChanges {
  /*
   * Expects an object with the following fields:
   * - content: a string referring to an entry in the i18n files
   * - tooltipPlacement: a PlacementArray describing where the tooltip should expand, relative to the tooltip icon
   * - iconPlacement: a string 'left' or 'right', describing where the tooltip icon should be placed, relative to the element
   */
  @Input() dsContextHelp: string | ContextHelpDirectiveInput;

  protected wrapper: ComponentRef<ContextHelpWrapperComponent>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
  ){}

  ngOnChanges() {
    const input: ContextHelpDirectiveInput = typeof(this.dsContextHelp) === 'string'
      ? {content: this.dsContextHelp}
      : this.dsContextHelp;

    const factory
      = this.componentFactoryResolver.resolveComponentFactory(ContextHelpWrapperComponent);
    this.wrapper = this.viewContainerRef.createComponent(factory);
    this.wrapper.instance.templateRef = this.templateRef;
    this.wrapper.instance.content = input.content;
    this.wrapper.instance.tooltipPlacement = input.tooltipPlacement;
    this.wrapper.instance.iconPlacement = input.iconPlacement;
  }
}
