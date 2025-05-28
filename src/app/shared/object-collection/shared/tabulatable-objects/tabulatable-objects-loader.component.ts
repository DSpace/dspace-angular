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
  ViewChild,
} from '@angular/core';
import {
  combineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { take } from 'rxjs/operators';

import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { Context } from '../../../../core/shared/context.model';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import {
  hasNoValue,
  hasValue,
  isNotEmpty,
} from '../../../empty.util';
import { ThemeService } from '../../../theme-support/theme.service';
import { CollectionElementLinkType } from '../../collection-element-link.type';
import { ListableObject } from '../listable-object.model';
import { getTabulatableObjectsComponent } from './tabulatable-objects.decorator';
import { TabulatableObjectsDirective } from './tabulatable-objects.directive';

@Component({
  selector: 'ds-tabulatable-objects-loader',
  templateUrl: './tabulatable-objects-loader.component.html',
  imports: [
    TabulatableObjectsDirective,
  ],
  standalone: true,
})
/**
 * Component to load the matching component flagged by the tabulatableObjectsComponent decorator.
 * Each component flagged by the decorator needs to have a ViewMode set as Table in order to be matched by the loader.
 * e.g. @tabulatableObjectsComponent(PaginatedList<AdminNotifySearchResult>, ViewMode.Table, Context.CoarNotify)
 */
export class TabulatableObjectsLoaderComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * The items to determine the component for
   */
  @Input() objects: PaginatedList<ListableObject>;


  /**
   * The context of tabulatable object
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
  @ViewChild(TabulatableObjectsDirective, { static: true }) tabulatableObjectsDirective: TabulatableObjectsDirective;

  /**
   * Emit when the listable object has been reloaded.
   */
  @Output() contentChange = new EventEmitter<PaginatedList<ListableObject>>();

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
   * The view mode used to identify the components
   */
  protected viewMode: ViewMode = ViewMode.Table;

  /**
   * The list of input and output names for the dynamic component
   */
  protected inAndOutputNames: string[] = [
    'objects',
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
    this.instantiateComponent(this.objects);
  }

  /**
   * Whenever the inputs change, update the inputs of the dynamic component
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (hasNoValue(this.compRef)) {
      // sometimes the component has not been initialized yet, so it first needs to be initialized
      // before being called again
      this.instantiateComponent(this.objects, changes);
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

  private instantiateComponent(objects: PaginatedList<ListableObject>, changes?: SimpleChanges): void {
    // objects need to have same render type so we access just the first in the page
    const component = this.getComponent(objects?.page[0]?.getRenderTypes(), this.viewMode, this.context);

    const viewContainerRef = this.tabulatableObjectsDirective.viewContainerRef;
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

    if ((this.compRef.instance as any).reloadedObject) {
      combineLatest([
        of(changes),
        (this.compRef.instance as any).reloadedObject.pipe(take(1)) as Observable<PaginatedList<ListableObject>>,
      ]).subscribe(([simpleChanges, reloadedObjects]: [SimpleChanges, PaginatedList<ListableObject>]) => {
        if (reloadedObjects) {
          this.compRef.destroy();
          this.objects = reloadedObjects;
          this.instantiateComponent(reloadedObjects, simpleChanges);
          this.cdr.detectChanges();
          this.contentChange.emit(reloadedObjects);
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
    return getTabulatableObjectsComponent(renderTypes, viewMode, context, this.themeService.getThemeName());
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
