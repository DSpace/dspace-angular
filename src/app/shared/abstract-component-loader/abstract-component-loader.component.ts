import { Component, ComponentRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Context } from '../../core/shared/context.model';
import { ThemeService } from '../theme-support/theme.service';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { hasNoValue, hasValue, isNotEmpty } from '../empty.util';
import { Subscription } from 'rxjs';
import { DynamicComponentLoaderDirective } from './dynamic-component-loader.directive';

@Component({
  selector: 'ds-abstract-component-loader',
  templateUrl: './abstract-component-loader.component.html',
})
export abstract class AbstractComponentLoaderComponent<T> implements OnInit, OnChanges, OnDestroy {

  /**
   * The optional context
   */
  @Input() context: Context;

  /**
   * Directive to determine where the dynamic child component is located
   */
  @ViewChild(DynamicComponentLoaderDirective, { static: true }) componentDirective: DynamicComponentLoaderDirective;

  /**
   * The reference to the dynamic component
   */
  protected compRef: ComponentRef<T>;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  protected subs: Subscription[] = [];

  protected inAndOutputNames: (keyof this)[] = [
    'context',
  ];

  constructor(
    protected themeService: ThemeService,
  ) {
  }

  /**
   * Set up the dynamic child component
   */
  ngOnInit(): void {
    this.instantiateComponent();
  }

  /**
   * Whenever the inputs change, update the inputs of the dynamic component
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (hasNoValue(this.compRef)) {
      // sometimes the component has not been initialized yet, so it first needs to be initialized
      // before being called again
      this.instantiateComponent(changes);
    } else {
      // if an input or output has changed
      if (this.inAndOutputNames.some((name: any) => hasValue(changes[name]))) {
        this.connectInputsAndOutputs();
        if (this.compRef?.instance && 'ngOnChanges' in this.compRef.instance) {
          (this.compRef.instance as any).ngOnChanges(changes);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.subs
      .filter((subscription: Subscription) => hasValue(subscription))
      .forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public instantiateComponent(changes?: SimpleChanges): void {
    const component: GenericConstructor<T> = this.getComponent();

    const viewContainerRef: ViewContainerRef = this.componentDirective.viewContainerRef;
    viewContainerRef.clear();

    this.compRef = viewContainerRef.createComponent(
      component, {
        index: 0,
        injector: undefined,
      },
    );

    if (hasValue(changes)) {
      this.ngOnChanges(changes);
    } else {
      this.connectInputsAndOutputs();
    }
  }

  /**
   * Fetch the component depending on the item's entity type, metadata representation type and context
   */
  public abstract getComponent(): GenericConstructor<T>;

  /**
   * Connect the in and outputs of this component to the dynamic component,
   * to ensure they're in sync
   */
  protected connectInputsAndOutputs(): void {
    if (isNotEmpty(this.inAndOutputNames) && hasValue(this.compRef) && hasValue(this.compRef.instance)) {
      this.inAndOutputNames.filter((name: any) => this[name] !== undefined).forEach((name: any) => {
        this.compRef.instance[name] = this[name];
      });
    }
  }

}
