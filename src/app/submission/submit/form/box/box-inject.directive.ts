import {
  ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, SimpleChanges, Type, ViewContainerRef
} from '@angular/core';

@Directive({
  selector: '[dsInjectBoxTemplate]'
})
export class InjectBoxTemplateDirective implements OnChanges {
  @Input() component: Type<any>;
  @Input() compileContext: any;

  compRef: ComponentRef<any>;

  constructor(private vcRef: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.component && this.component) {
      this.vcRef.clear();
      this.compRef = null;

      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
      this.compRef = this.vcRef.createComponent(componentFactory);
      this.updateProperties();
    }
  }

  updateProperties() {
    for (const prop in this.compileContext) {
      if (this.compileContext[prop]) {
        this.compRef.instance[prop] = this.compileContext[prop];
      }
    }
  }
}
