import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { Subscription, combineLatest, of as observableOf, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ListableObject } from '../listable-object.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Context } from '../../../../core/shared/context.model';
import { getListableObjectComponent } from './listable-object.decorator';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { ListableObjectDirective } from './listable-object.directive';
import { CollectionElementLinkType } from '../../collection-element-link.type';
import { hasValue, isNotEmpty, hasNoValue } from '../../../empty.util';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { ThemeService } from '../../../theme-support/theme.service';

@Component({
  selector: 'ds-listable-object-component-loader',
  styleUrls: ['./listable-object-component-loader.component.scss'],
  templateUrl: './listable-object-component-loader.component.html'
})
/**
 * Component for determining what component to use depending on the item's entity type (dspace.entity.type)
 */
export class ListableObjectComponentLoaderComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * The item or metadata to determine the component for
   */
  @Input() object: ListableObject;

  /**
   * The index of the object in the list
   */
  @Input() index: number;

  /**
   * The preferred view-mode to display
   */
  @Input() viewMode: ViewMode;

  /**
   * The context of listable object
   */
  @Input() context: Context;

  /**
   * The type of link used to render the links inside the listable object
   */
  @Input() linkType: CollectionElementLinkType;

  /**
   * The identifier of the list this element resides in
   */
  @Input() listID: string;

  /**
   * Whether to show the badge label or not
   */
  @Input() showLabel = true;

  /**
   * Whether to show the thumbnail preview
   */
  @Input() showThumbnails;

  /**
   * The value to display for this element
   */
  @Input() value: string;

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild(ListableObjectDirective, { static: true }) listableObjectDirective: ListableObjectDirective;

  /**
   * Emit when the listable object has been reloaded.
   */
  @Output() contentChange = new EventEmitter<ListableObject>();

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * The reference to the dynamic component
   */
  protected compRef: ComponentRef<Component>;

  /**
   * The list of input and output names for the dynamic component
   */
  protected inAndOutputNames: string[] = [
    'object',
    'index',
    'linkType',
    'listID',
    'showLabel',
    'showThumbnails',
    'context',
    'viewMode',
    'value',
    'hideBadges',
    'contentChange',
  ];

  constructor(private cdr: ChangeDetectorRef, private themeService: ThemeService) {
  }

  /**
   * Setup the dynamic child component
   */
  ngOnInit(): void {
    this.instantiateComponent(this.object);
  }

  /**
   * Whenever the inputs change, update the inputs of the dynamic component
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (hasNoValue(this.compRef)) {
      // sometimes the component has not been initialized yet, so it first needs to be initialized
      // before being called again
      this.instantiateComponent(this.object, changes);
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

  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  private instantiateComponent(object: ListableObject, changes?: SimpleChanges): void {

    const component = this.getComponent(object.getRenderTypes(), this.viewMode, this.context);

    const viewContainerRef = this.listableObjectDirective.viewContainerRef;
    viewContainerRef.clear();

    this.compRef = viewContainerRef.createComponent(
      component, {
        index: 0,
        injector: undefined
      }
    );

    if (hasValue(changes)) {
      this.ngOnChanges(changes);
    } else {
      this.connectInputsAndOutputs();
    }

    if ((this.compRef.instance as any).reloadedObject) {
      combineLatest([
        observableOf(changes),
        (this.compRef.instance as any).reloadedObject.pipe(take(1)) as Observable<DSpaceObject>,
      ]).subscribe(([simpleChanges, reloadedObject]: [SimpleChanges, DSpaceObject]) => {
        if (reloadedObject) {
          this.compRef.destroy();
          this.object = reloadedObject;
          this.instantiateComponent(reloadedObject, simpleChanges);
          this.cdr.detectChanges();
          this.contentChange.emit(reloadedObject);
        }
      });
    }
  }

  /**
   * Fetch the component depending on the item's entity type, view mode and context
   * @returns {GenericConstructor<Component>}
   */
  getComponent(renderTypes: (string | GenericConstructor<ListableObject>)[],
               viewMode: ViewMode,
               context: Context): GenericConstructor<Component> {
    return getListableObjectComponent(renderTypes, viewMode, context, this.themeService.getThemeName());
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
