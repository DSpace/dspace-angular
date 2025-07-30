import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { Context } from '../../../../core/shared/context.model';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { AbstractComponentLoaderComponent } from '../../../abstract-component-loader/abstract-component-loader.component';
import { DynamicComponentLoaderDirective } from '../../../abstract-component-loader/dynamic-component-loader.directive';
import { CollectionElementLinkType } from '../../collection-element-link.type';
import { ListableObject } from '../listable-object.model';
import { getTabulatableObjectsComponent } from './tabulatable-objects.decorator';

@Component({
  selector: 'ds-tabulatable-objects-loader',
  templateUrl: '../../../abstract-component-loader/abstract-component-loader.component.html',
  standalone: true,
  imports: [
    DynamicComponentLoaderDirective,
  ],
})
/**
 * Component to load the matching component flagged by the tabulatableObjectsComponent decorator.
 * Each component flagged by the decorator needs to have a ViewMode set as Table in order to be matched by the loader.
 * e.g. @tabulatableObjectsComponent(PaginatedList<AdminNotifySearchResult>, ViewMode.Table, Context.CoarNotify)
 */
export class TabulatableObjectsLoaderComponent extends AbstractComponentLoaderComponent<Component> {
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
  @Input() showThumbnails: boolean;

  /**
   * The value to display for this element
   */
  @Input() value: string;

  /**
   * The view mode used to identify the components
   */
  @Input() viewMode: ViewMode;

  /**
   * Emit when the listable object has been reloaded.
   */
  @Output() contentChange = new EventEmitter<PaginatedList<ListableObject>>();

  /**
   * The list of input and output names for the dynamic component
   */
  protected inputNames: (keyof this & string)[] = [
    'objects',
    'linkType',
    'listID',
    'showLabel',
    'showThumbnails',
    'context',
    'viewMode',
    'value',
  ];

  protected outputNames: (keyof this & string)[] = [
    'contentChange',
  ];

  protected inputNamesDependentForComponent: (keyof this & string)[] = [
    'objects',
    'viewMode',
    'context',
  ];

  getComponent(): Promise<GenericConstructor<Component>> {
    return getTabulatableObjectsComponent(this.objects?.page[0]?.getRenderTypes(), this.viewMode, this.context, this.themeService.getThemeName());
  }

}
