import {
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Context } from '../../../../core/shared/context.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import {
  hasNoValue,
  hasValue,
  isNotEmpty,
} from '../../../../shared/empty.util';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { DsoEditMetadataValue } from '../../dso-edit-metadata-form';
import { EditMetadataValueFieldType } from '../dso-edit-metadata-field-type.enum';
import { getDsoEditMetadataValueFieldComponent } from './dso-edit-metadata-value-field.decorator';
import { DsoEditMetadataValueFieldLoaderDirective } from './dso-edit-metadata-value-field-loader.directive';

@Component({
  selector: 'ds-dso-edit-metadata-value-field-loader',
  templateUrl: './dso-edit-metadata-value-field-loader.component.html',
})
export class DsoEditMetadataValueFieldLoaderComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * The optional context
   */
  @Input() context: Context;

  /**
   * The {@link DSpaceObject}
   */
  @Input() dso: DSpaceObject;

  /**
   * The type of the DSO, used to determines i18n messages
   */
  @Input() dsoType: string;

  /**
   * The type of the field
   */
  @Input() type: EditMetadataValueFieldType;

  /**
   * The metadata field
   */
  @Input() mdField: string;

  /**
   * Editable metadata value to show
   */
  @Input() mdValue: DsoEditMetadataValue;

  /**
   * Emits when the user clicked confirm
   */
  @Output() confirm: EventEmitter<boolean> = new EventEmitter();

  /**
   * Directive to determine where the dynamic child component is located
   */
  @ViewChild(DsoEditMetadataValueFieldLoaderDirective, { static: true }) componentDirective: DsoEditMetadataValueFieldLoaderDirective;

  /**
   * The reference to the dynamic component
   */
  protected compRef: ComponentRef<Component>;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  protected subs: Subscription[] = [];

  protected inAndOutputNames: (keyof this)[] = [
    'context',
    'dso',
    'dsoType',
    'type',
    'mdField',
    'mdValue',
    'confirm',
  ];

  constructor(
    protected themeService: ThemeService,
  ) {
  }

  public getComponent(): GenericConstructor<Component> {
    return getDsoEditMetadataValueFieldComponent(this.type, this.context, this.themeService.getThemeName());
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
    const component: GenericConstructor<Component> = this.getComponent();
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
