import {
  Component, Input, ViewContainerRef, ViewChild, ReflectiveInjector, ComponentFactoryResolver,
  Type, Injectable
} from '@angular/core';
import { BoxContainerComponent } from './box-container.component';
import { BoxDataModel } from './box.model';

export interface FactoryDataModel {
  component: Type<any>;
  inputs: BoxDataModel;
}

@Injectable()
export class BoxFactoryComponent {

  currentComponent = null;

  // @ViewChild('dynamicBoxContent', { read: ViewContainerRef }) boxComponentContainer: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) {

  }

  // component: Class for the component you want to create
  // inputs: An object with key/value pairs mapped to input name/input value
  public get(factoryData: FactoryDataModel, boxHost: ViewContainerRef) {
    if (!factoryData) {
      return;
    }

    // const containerFactory  = this.resolver.resolveComponentFactory(factoryData.component);
    const containerFactory  = this.resolver.resolveComponentFactory(BoxContainerComponent);
    const containerRef = boxHost.createComponent(containerFactory);
    containerRef.instance.boxComponent = factoryData.component;
    for (const inputName of Object.keys(factoryData.inputs)) {
      (containerRef.instance as BoxDataModel)[inputName] = factoryData.inputs[inputName];
    }

    // Inputs need to be in the following format to be resolved properly
    /*const inputProviders = Object.keys(factoryData.inputs).map((inputName, containerRef) => {
      containerRef.instance.
      return {provide: inputName, useValue: factoryData.inputs[inputName]};
    });*/

    /*const resolvedInputs = ReflectiveInjector.resolve(inputProviders);
    // const injector = ReflectiveInjector.resolveAndCreate(inputProviders);
    const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, boxHost.parentInjector);
    // const componentRef = componentFactory.create(injector);
    // const containerRef = boxHost.createComponent(containerFactory, null, injector);
    const containerFactory  = this.resolver.resolveComponentFactory(BoxContainerComponent);
    const containerRef = containerFactory.create(injector);

    boxHost.insert(containerRef.hostView);

    console.log(containerRef.instance);

    // const componentFactory  = this.resolver.resolveComponentFactory(factoryData.component);
    containerRef.hostView.detectChanges();
    console.log(containerRef.instance);
*/
    // We create an injector out of the data we want to pass down and this components injector
    // const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.boxComponentContainer.parentInjector);

    // We create a factory out of the component we want to create
    // const componentFactory  = this.resolver.resolveComponentFactory(factoryData.component);

    // We create the component using the factory and the injector
    // const component = factory.create(injector);
    // const component = this.boxComponentContainer.createComponent(componentFactory, );
    // console.log(component.hostView);
    return containerRef;
    // We insert the component into the dom container
    // this.boxComponentContainer.insert(component.hostView);

    // We can destroy the old component is we like by calling destroy
    // if (this.currentComponent) {
    //  this.currentComponent.destroy();
    // }

    // this.currentComponent = component;
  }

}
