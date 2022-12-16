import { ComponentFactoryResolver, ComponentRef, Directive, ElementRef, Input, OnChanges, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { ContextHelpWrapperComponent } from './context-help-wrapper/context-help-wrapper.component';
import { PlacementDir } from './context-help-wrapper/placement-dir.model';

export type ContextHelpDirectiveInput = {
  content: string,
  tooltipPlacement?: PlacementArray,
  iconPlacement?: PlacementDir
}

@Directive({
  selector: '[dsContextHelp]',
})
export class ContextHelpDirective implements OnChanges {
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
