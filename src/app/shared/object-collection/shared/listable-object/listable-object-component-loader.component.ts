import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Context } from '../../../../core/shared/context.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { AbstractComponentLoaderComponent } from '../../../abstract-component-loader/abstract-component-loader.component';
import { ThemeService } from '../../../theme-support/theme.service';
import { CollectionElementLinkType } from '../../collection-element-link.type';
import { ListableObject } from '../listable-object.model';
import { getListableObjectComponent } from './listable-object.decorator';

@Component({
  selector: 'ds-listable-object-component-loader',
  styleUrls: ['./listable-object-component-loader.component.scss'],
  templateUrl: '../../../abstract-component-loader/abstract-component-loader.component.html',
  standalone: true,
})
/**
 * Component for determining what component to use depending on the item's entity type (dspace.entity.type)
 */
export class ListableObjectComponentLoaderComponent extends AbstractComponentLoaderComponent<Component> {

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
  @Input() showLabel: boolean;

  /**
   * Whether to show the metrics badges
   */
  @Input() showMetrics = true;

  /**
   * Whether to show the thumbnail preview
   */
  @Input() showThumbnails: boolean;

  /**
   * Whether to show if the item is a correction
   */
  @Input() showCorrection = false;

  /**
   * A boolean representing if to show workflow statistics
   */
  @Input() showWorkflowStatistics: boolean;

  /**
   * The value to display for this element
   */
  @Input() value: string;

  /**
   * Whether or not informational badges (e.g. Private, Withdrawn) should be hidden
   */
  @Input() hideBadges = false;

  /**
   * Pass custom data to the component for custom utilization
   */
  @Input() customData: any;

  /**
   * Emit when the listable object has been reloaded.
   */
  @Output() contentChange = new EventEmitter<ListableObject>();

  /**
   * Emit custom event for listable object custom actions.
   */
  @Output() customEvent = new EventEmitter<any>();

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
  protected inputNames: (keyof this & string)[] = [
    'object',
    'customData',
    'index',
    'context',
    'linkType',
    'listID',
    'showLabel',
    'showMetrics',
    'showThumbnails',
    'showCorrection',
    'showWorkflowStatistics',
    'context',
    'viewMode',
    'value',
  ];

  protected outputNames: (keyof this & string)[] = [
    'contentChange',
  ];

  constructor(
    protected themeService: ThemeService,
    protected cdr: ChangeDetectorRef,
  ) {
    super(themeService);
  }

  public instantiateComponent(): void {
    super.instantiateComponent();
    if ((this.compRef.instance as any).reloadedObject) {
      (this.compRef.instance as any).reloadedObject.pipe(
        take(1),
      ).subscribe((reloadedObject: DSpaceObject) => {
        if (reloadedObject) {
          this.destroyComponentInstance();
          this.object = reloadedObject;
          this.instantiateComponent();
          this.cdr.detectChanges();
          this.contentChange.emit(reloadedObject);
        }
      });
    }


    if ((this.compRef.instance as any).customEvent) {
      (this.compRef.instance as any).customEvent.subscribe((event: any) => {
        if (event) {
          this.customEvent.emit(event);
        }
      });
    }

  }

  public getComponent(): GenericConstructor<Component> {
    return getListableObjectComponent(this.object.getRenderTypes(), this.viewMode, this.context, this.themeService.getThemeName());
  }

}
