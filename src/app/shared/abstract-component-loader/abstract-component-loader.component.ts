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

  /**
   * The @{@link Input}() that are used to find the matching component using {@link getComponent}. When the value of
   * one of these @{@link Input}() change this loader needs to retrieve the best matching component again using the
   * {@link getComponent} method.
   */
  protected inputNamesDependentForComponent: (keyof this & string)[] = [
    'context',
  ];

  protected inputNames: (keyof this & string)[] = [
    'context',
  ];

  protected outputNames: (keyof this & string)[] = [
  ];

  constructor(
    protected themeService: ThemeService,
  ) {
  }

  /**
   * Set up the dynamic child component
   */
  ngOnInit(): void {
    if (hasNoValue(this.compRef)) {
      this.instantiateComponent();
    }
  }

  /**
   * Whenever the inputs change, update the inputs of the dynamic component
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (hasNoValue(this.compRef)) {
      // sometimes the component has not been initialized yet, so it first needs to be initialized
      // before being called again
      this.instantiateComponent();
    } else {
      if (this.inputNamesDependentForComponent.some((name: any) => hasValue(changes[name]) && changes[name].previousValue !== changes[name].currentValue)) {
        // Recreate the component when the @Input()s used by getComponent() aren't up-to-date anymore
        this.destroyComponentInstance();
        this.instantiateComponent();
      } else {
        this.connectInputsAndOutputs();
      }
    }
  }

  ngOnDestroy(): void {
    this.subs
      .filter((subscription: Subscription) => hasValue(subscription))
      .forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * Creates the component and connects the @Input() & @Output() from the ThemedComponent to its child Component.
   */
  public instantiateComponent(): void {
    const component: GenericConstructor<T> = this.getComponent();

    const viewContainerRef: ViewContainerRef = this.componentDirective.viewContainerRef;
    viewContainerRef.clear();

    this.compRef = viewContainerRef.createComponent(
      component, {
        index: 0,
        injector: undefined,
      },
    );

    this.connectInputsAndOutputs();
  }

  /**
   * Destroys the themed component and calls it's `ngOnDestroy`
   */
  public destroyComponentInstance(): void {
    if (hasValue(this.compRef)) {
      this.compRef.destroy();
      this.compRef = null;
    }
  }

  /**
   * Fetch the component depending on the item's entity type, metadata representation type and context
   */
  public abstract getComponent(): GenericConstructor<T>;

  /**
   * Connect the inputs and outputs of this component to the dynamic component,
   * to ensure they're in sync
   */
  protected connectInputsAndOutputs(): void {
    if (isNotEmpty(this.inputNames) && hasValue(this.compRef) && hasValue(this.compRef.instance)) {
      this.inputNames.filter((name: string) => this[name] !== undefined).filter((name: string) => this[name] !== this.compRef.instance[name]).forEach((name: string) => {
        // Using setInput will automatically trigger the ngOnChanges
        this.compRef.setInput(name, this[name]);
      });
    }
    if (isNotEmpty(this.outputNames) && hasValue(this.compRef) && hasValue(this.compRef.instance)) {
      this.outputNames.filter((name: string) => this[name] !== undefined).filter((name: string) => this[name] !== this.compRef.instance[name]).forEach((name: string) => {
        this.compRef.instance[name] = this[name];
      });
    }
  }

}
