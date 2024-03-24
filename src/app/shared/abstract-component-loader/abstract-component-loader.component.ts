import {
  Component,
  ComponentRef,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { GenericConstructor } from '../../core/shared/generic-constructor';
import {
  hasValue,
  isNotEmpty,
} from '../empty.util';
import { ThemeService } from '../theme-support/theme.service';
import { DynamicComponentLoaderDirective } from './dynamic-component-loader.directive';

/**
 * To create a new loader component you will need to:
 * <ul>
 *   <li>Create a new LoaderComponent component extending this component</li>
 *   <li>Point the templateUrl to this component's templateUrl</li>
 *   <li>Add all the @Input()/@Output() names that the dynamically generated components should inherit from the loader to the inputNames/outputNames lists</li>
 *   <li>Create a decorator file containing the new decorator function, a map containing all the collected {@link Component}s and a function to retrieve the {@link Component}</li>
 *   <li>Call the function to retrieve the correct {@link Component} in getComponent()</li>
 *   <li>Add all the @Input()s you had to used in getComponent() in the inputNamesDependentForComponent array</li>
 * </ul>
 */
@Component({
  selector: 'ds-abstract-component-loader',
  templateUrl: './abstract-component-loader.component.html',
  standalone: true,
  imports: [
    DynamicComponentLoaderDirective,
  ],
})
export abstract class AbstractComponentLoaderComponent<T> implements OnInit, OnChanges, OnDestroy {

  /**
   * Directive to determine where the dynamic child component is located
   */
  @ViewChild('DynamicComponentLoader', { static: true, read: ViewContainerRef }) componentViewContainerRef: ViewContainerRef;

  /**
   * The reference to the dynamic component
   */
  protected compRef: ComponentRef<T>;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  protected subs: Subscription[] = [];

  /**
   * The @Input() that are used to find the matching component using {@link getComponent}. When the value of
   * one of these @Input() change this loader needs to retrieve the best matching component again using the
   * {@link getComponent} method.
   */
  protected inputNamesDependentForComponent: (keyof this & string)[] = [];

  /**
   * The list of the @Input() names that should be passed down to the dynamically created components.
   */
  protected inputNames: (keyof this & string)[] = [];

  /**
   * The list of the @Output() names that should be passed down to the dynamically created components.
   */
  protected outputNames: (keyof this & string)[] = [];

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
    if (hasValue(this.compRef)) {
      if (this.inputNamesDependentForComponent.some((name: keyof this & string) => hasValue(changes[name]) && changes[name].previousValue !== changes[name].currentValue)) {
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
    this.destroyComponentInstance();
  }

  /**
   * Creates the component and connects the @Input() & @Output() from the ThemedComponent to its child Component.
   */
  public instantiateComponent(): void {
    const component: GenericConstructor<T> = this.getComponent();

    const viewContainerRef: ViewContainerRef = this.componentViewContainerRef;
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
   * to ensure they're in sync, the ngOnChanges method will automatically be called by setInput
   */
  public connectInputsAndOutputs(): void {
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
