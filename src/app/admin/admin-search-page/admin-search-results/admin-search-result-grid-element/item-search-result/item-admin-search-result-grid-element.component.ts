import {
  Component,
  ComponentRef,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { Context } from '../../../../../core/shared/context.model';
import { GenericConstructor } from '../../../../../core/shared/generic-constructor';
import { Item } from '../../../../../core/shared/item.model';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { DynamicComponentLoaderDirective } from '../../../../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { hasValue } from '../../../../../shared/empty.util';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import {
  getListableObjectComponent,
  listableObjectComponent,
} from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/search-result-grid-element.component';
import { ThemeService } from '../../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { ItemAdminSearchResultActionsComponent } from '../../item-admin-search-result-actions.component';

@listableObjectComponent(ItemSearchResult, ViewMode.GridElement, Context.AdminSearch)
@Component({
  selector: 'ds-item-admin-search-result-grid-element',
  styleUrls: ['./item-admin-search-result-grid-element.component.scss'],
  templateUrl: './item-admin-search-result-grid-element.component.html',
  standalone: true,
  imports: [ItemAdminSearchResultActionsComponent, DynamicComponentLoaderDirective],
})
/**
 * The component for displaying a list element for an item search result on the admin search page
 */
export class ItemAdminSearchResultGridElementComponent extends SearchResultGridElementComponent<ItemSearchResult, Item> implements OnDestroy, OnInit {
  @ViewChild(DynamicComponentLoaderDirective, { static: true }) dynamicComponentLoaderDirective: DynamicComponentLoaderDirective;
  @ViewChild('badges', { static: true }) badges: ElementRef;
  @ViewChild('buttons', { static: true }) buttons: ElementRef;

  protected compRef: ComponentRef<Component>;

  constructor(
    public dsoNameService: DSONameService,
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
    private themeService: ThemeService,
  ) {
    super(dsoNameService, truncatableService, bitstreamDataService);
  }

  /**
   * Setup the dynamic child component
   */
  ngOnInit(): void {
    super.ngOnInit();
    const component: GenericConstructor<Component> = this.getComponent();

    const viewContainerRef = this.dynamicComponentLoaderDirective.viewContainerRef;
    viewContainerRef.clear();

    this.compRef = viewContainerRef.createComponent(
      component, {
        index: 0,
        injector: undefined,
        projectableNodes: [
          [this.badges.nativeElement],
          [this.buttons.nativeElement],
        ],
      },
    );
    this.compRef.setInput('object',this.object);
    this.compRef.setInput('index', this.index);
    this.compRef.setInput('linkType', this.linkType);
    this.compRef.setInput('listID', this.listID);
  }

  ngOnDestroy(): void {
    if (hasValue(this.compRef)) {
      this.compRef.destroy();
      this.compRef = undefined;
    }
  }

  /**
   * Fetch the component depending on the item's entity type, view mode and context
   * @returns {GenericConstructor<Component>}
   */
  private getComponent(): GenericConstructor<Component> {
    return getListableObjectComponent(this.object.getRenderTypes(), ViewMode.GridElement, undefined, this.themeService.getThemeName());
  }
}
