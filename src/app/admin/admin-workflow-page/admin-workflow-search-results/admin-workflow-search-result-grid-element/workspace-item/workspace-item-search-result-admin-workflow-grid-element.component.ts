import { AsyncPipe } from '@angular/common';
import {
  Component,
  ComponentRef,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { hasValue } from '@dspace/shared/utils';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  map,
  mergeMap,
  take,
  tap,
} from 'rxjs/operators';

import { DSONameService } from '../../../../../../../modules/core/src/lib/core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../../../../modules/core/src/lib/core/cache/builders/link.service';
import { BitstreamDataService } from '../../../../../../../modules/core/src/lib/core/data/bitstream-data.service';
import { followLink } from '../../../../../../../modules/core/src/lib/core/data/follow-link-config.model';
import { PaginatedList } from '../../../../../../../modules/core/src/lib/core/data/paginated-list.model';
import { RemoteData } from '../../../../../../../modules/core/src/lib/core/data/remote-data';
import { WorkspaceItemSearchResult } from '../../../../../../../modules/core/src/lib/core/object-collection/workspace-item-search-result.model';
import { Context } from '../../../../../../../modules/core/src/lib/core/shared/context.model';
import { DSpaceObject } from '../../../../../../../modules/core/src/lib/core/shared/dspace-object.model';
import { GenericConstructor } from '../../../../../../../modules/core/src/lib/core/shared/generic-constructor';
import { Item } from '../../../../../../../modules/core/src/lib/core/shared/item.model';
import {
  getAllSucceededRemoteData,
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../../../../../../../modules/core/src/lib/core/shared/operators';
import { ViewMode } from '../../../../../../../modules/core/src/lib/core/shared/view-mode.model';
import { WorkspaceItem } from '../../../../../../../modules/core/src/lib/core/submission/models/workspaceitem.model';
import { SupervisionOrder } from '../../../../../../../modules/core/src/lib/core/supervision-order/models/supervision-order.model';
import { SupervisionOrderDataService } from '../../../../../../../modules/core/src/lib/core/supervision-order/supervision-order-data.service';
import { DynamicComponentLoaderDirective } from '../../../../../shared/abstract-component-loader/dynamic-component-loader.directive';
import {
  getListableObjectComponent,
  listableObjectComponent,
} from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/search-result-grid-element.component';
import { ThemeService } from '../../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { WorkspaceItemAdminWorkflowActionsComponent } from '../../actions/workspace-item/workspace-item-admin-workflow-actions.component';

@listableObjectComponent(WorkspaceItemSearchResult, ViewMode.GridElement, Context.AdminWorkflowSearch)
@Component({
  selector: 'ds-workflow-item-search-result-admin-workflow-grid-element',
  styleUrls: ['./workspace-item-search-result-admin-workflow-grid-element.component.scss'],
  templateUrl: './workspace-item-search-result-admin-workflow-grid-element.component.html',
  standalone: true,
  imports: [WorkspaceItemAdminWorkflowActionsComponent, AsyncPipe, TranslateModule, DynamicComponentLoaderDirective],
})
/**
 * The component for displaying a grid element for an workflow item on the admin workflow search page
 */
export class WorkspaceItemSearchResultAdminWorkflowGridElementComponent extends SearchResultGridElementComponent<WorkspaceItemSearchResult, WorkspaceItem> implements OnDestroy, OnInit {

  /**
   * The item linked to the workspace item
   */
  public item$: Observable<Item>;

  /**
   * The id of the item linked to the workflow item
   */
  public itemId: string;

  /**
   * The supervision orders linked to the workflow item
   */
  public supervisionOrder$: BehaviorSubject<SupervisionOrder[]> = new BehaviorSubject<SupervisionOrder[]>([]);

  /**
   * Directive used to render the dynamic component in
   */
  @ViewChild(DynamicComponentLoaderDirective, { static: true }) dynamicComponentLoaderDirective: DynamicComponentLoaderDirective;

  /**
   * The html child that contains the badges html
   */
  @ViewChild('badges', { static: true }) badges: ElementRef;

  /**
   * The html child that contains the button html
   */
  @ViewChild('buttons', { static: true }) buttons: ElementRef;

  /**
   * The reference to the dynamic component
   */
  protected compRef: ComponentRef<Component>;

  constructor(
    public dsoNameService: DSONameService,
    private linkService: LinkService,
    protected truncatableService: TruncatableService,
    private themeService: ThemeService,
    protected bitstreamDataService: BitstreamDataService,
    protected supervisionOrderDataService: SupervisionOrderDataService,
  ) {
    super(dsoNameService, truncatableService, bitstreamDataService);
  }

  /**
   * Setup the dynamic child component
   * Initialize the item object from the workflow item
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.dso = this.linkService.resolveLink(this.dso, followLink('item'));
    this.item$ = (this.dso.item as Observable<RemoteData<Item>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload());
    this.item$.pipe(take(1)).subscribe((item: Item) => {
      const component: GenericConstructor<Component> = this.getComponent(item);

      const viewContainerRef = this.dynamicComponentLoaderDirective.viewContainerRef;
      viewContainerRef.clear();

      this.compRef = viewContainerRef.createComponent(
        component, {
          index: 0,
          projectableNodes: [
            [this.badges.nativeElement],
            [this.buttons.nativeElement],
          ],
        });
      this.compRef.setInput('object', item);
      this.compRef.setInput('index', this.index);
      this.compRef.setInput('linkType', this.linkType);
      this.compRef.setInput('listID', this.listID);
      this.compRef.changeDetectorRef.detectChanges();
    },
    );

    this.item$.pipe(
      take(1),
      tap((item: Item) => this.itemId = item.id),
      mergeMap((item: Item) => this.retrieveSupervisorOrders(item.id)),
    ).subscribe((supervisionOrderList: SupervisionOrder[]) => {
      this.supervisionOrder$.next(supervisionOrderList);
    });
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
  private getComponent(item: Item): GenericConstructor<Component> {
    return getListableObjectComponent(item.getRenderTypes(), ViewMode.GridElement, undefined, this.themeService.getThemeName());
  }


  /**
   * Retrieve the list of SupervisionOrder object related to the given item
   *
   * @param itemId
   * @private
   */
  private retrieveSupervisorOrders(itemId): Observable<SupervisionOrder[]> {
    return this.supervisionOrderDataService.searchByItem(
      itemId, false, true, followLink('group'),
    ).pipe(
      getFirstCompletedRemoteData(),
      map((soRD: RemoteData<PaginatedList<SupervisionOrder>>) => soRD.hasSucceeded && !soRD.hasNoContent ? soRD.payload.page : []),
    );
  }

  reloadObject(dso: DSpaceObject) {
    this.reloadedObject.emit(dso);
  }
}
