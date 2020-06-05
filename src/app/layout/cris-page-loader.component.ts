import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, OnDestroy, ComponentRef } from '@angular/core';
import { Item } from '../core/shared/item.model';
import { CrisLayoutLoaderDirective } from './directives/cris-layout-loader.directive';
import { GenericConstructor } from '../core/shared/generic-constructor';
import { getCrisLayoutPage } from './decorators/cris-layout-page.decorator';

/**
 * Component for determining what component to use depending on the item's relationship type (relationship.type)
 */
@Component({
  selector: 'ds-cris-page-loader',
  templateUrl: './cris-page-loader.component.html',
  styleUrls: ['./cris-page-loader.component.scss']
})
export class CrisPageLoaderComponent implements OnInit, OnDestroy {
  /**
   * DSpace Item to render
   */
  @Input() item: Item;
  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild(CrisLayoutLoaderDirective, {static: true}) crisLayoutLoader: CrisLayoutLoaderDirective;

  componentRef: ComponentRef<Component>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  /**
   * Setup the dynamic child component
   */
  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.getComponent());
    const viewContainerRef = this.crisLayoutLoader.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    (this.componentRef.instance as any).item = this.item;
  }

  /**
   * Fetch the component depending on the item
   * @returns {GenericConstructor<Component>}
   */
  private getComponent(): GenericConstructor<Component> {
    return getCrisLayoutPage(this.item);
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
