import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { ContextHelpWrapperComponent, PlacementDir } from './context-help-wrapper/context-help-wrapper.component';

@Directive({
  selector: '[dsContextHelp]'
})
export class ContextHelpDirective implements OnInit {
  @Input('dsContextHelp') content: string;
  @Input('dsTooltipPlacement') tooltipPlacement: PlacementArray;
  // @Input('iconPlacement') iconPlacement: PlacementDir;

  protected wrapper: ComponentRef<ContextHelpWrapperComponent>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ){}

  ngOnInit() {
    const factory
      = this.componentFactoryResolver.resolveComponentFactory(ContextHelpWrapperComponent);
    this.wrapper = this.viewContainerRef.createComponent(factory);
    this.wrapper.instance.templateRef = this.templateRef;
    this.wrapper.instance.content = this.content;
    this.wrapper.instance.tooltipPlacement = this.tooltipPlacement;
  }
}
