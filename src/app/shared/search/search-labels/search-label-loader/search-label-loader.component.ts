import { Component, ComponentRef, OnChanges, OnDestroy, OnInit, ViewChild, ViewContainerRef, SimpleChanges, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GenericConstructor } from 'src/app/core/shared/generic-constructor';
import { hasValue, isNotEmpty } from 'src/app/shared/empty.util';
import { ThemeService } from '../../../theme-support/theme.service';
import { SearchLabelLoaderDirective } from './search-label-loader-directive.directive';
import { getSearchLabelByOperator } from './search-label-loader.decorator';
import { AppliedFilter } from '../../models/applied-filter.model';

@Component({
  selector: 'ds-search-label-loader',
  templateUrl: './search-label-loader.component.html',
})
export class SearchLabelLoaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() inPlaceSearch: boolean;

  @Input() appliedFilter: AppliedFilter;

  /**
   * Directive to determine where the dynamic child component is located
   */
  @ViewChild(SearchLabelLoaderDirective, { static: true }) componentDirective: SearchLabelLoaderDirective;

  /**
   * The reference to the dynamic component
   */
  protected compRef: ComponentRef<Component>;

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
  protected inputNames: (keyof this & string)[] = [
    'inPlaceSearch',
    'appliedFilter',
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
    const component: GenericConstructor<Component> = this.getComponent();

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
  public getComponent(): GenericConstructor<Component> {
    return getSearchLabelByOperator(this.appliedFilter.operator);
  }

  /**
   * Connect the inputs and outputs of this component to the dynamic component,
   * to ensure they're in sync
   */
  public connectInputsAndOutputs(): void {
    if (isNotEmpty(this.inputNames) && hasValue(this.compRef) && hasValue(this.compRef.instance)) {
      this.inputNames.filter((name: string) => this[name] !== undefined).filter((name: string) => this[name] !== this.compRef.instance[name]).forEach((name: string) => {
        this.compRef.instance[name] = this[name];
      });
    }
  }

}
