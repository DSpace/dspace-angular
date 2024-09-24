import { Component, ElementRef, ViewChild, ComponentRef, OnDestroy, OnInit } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import {
  getListableObjectComponent,
  listableObjectComponent
} from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../core/shared/context.model';
import { SearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/search-result-grid-element.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { GenericConstructor } from '../../../../../core/shared/generic-constructor';
import { ListableObjectDirective } from '../../../../../shared/object-collection/shared/listable-object/listable-object.directive';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { Observable } from 'rxjs';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { followLink } from '../../../../../shared/utils/follow-link-config.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import {
  getAllSucceededRemoteData,
  getRemoteDataPayload
} from '../../../../../core/shared/operators';
import { take } from 'rxjs/operators';
import { WorkflowItemSearchResult } from '../../../../../shared/object-collection/shared/workflow-item-search-result.model';
import { ThemeService } from '../../../../../shared/theme-support/theme.service';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { hasValue } from '../../../../../shared/empty.util';

@listableObjectComponent(WorkflowItemSearchResult, ViewMode.GridElement, Context.AdminWorkflowSearch)
@Component({
  selector: 'ds-workflow-item-search-result-admin-workflow-grid-element',
  styleUrls: ['./workflow-item-search-result-admin-workflow-grid-element.component.scss'],
  templateUrl: './workflow-item-search-result-admin-workflow-grid-element.component.html'
})
/**
 * The component for displaying a grid element for an workflow item on the admin workflow search page
 */
export class WorkflowItemSearchResultAdminWorkflowGridElementComponent extends SearchResultGridElementComponent<WorkflowItemSearchResult, WorkflowItem> implements OnDestroy, OnInit {
  /**
   * Directive used to render the dynamic component in
   */
  @ViewChild(ListableObjectDirective, { static: true }) listableObjectDirective: ListableObjectDirective;

  /**
   * The html child that contains the badges html
   */
  @ViewChild('badges', { static: true }) badges: ElementRef;

  /**
   * The html child that contains the button html
   */
  @ViewChild('buttons', { static: true }) buttons: ElementRef;

  /**
   * The item linked to the workflow item
   */
  public item$: Observable<Item>;

  protected compRef: ComponentRef<Component>;

  constructor(
    public dsoNameService: DSONameService,
    private linkService: LinkService,
    protected truncatableService: TruncatableService,
    private themeService: ThemeService,
    protected bitstreamDataService: BitstreamDataService
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

      const viewContainerRef = this.listableObjectDirective.viewContainerRef;
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
      this.compRef.setInput('object', item);
      this.compRef.setInput('index', this.index);
      this.compRef.setInput('linkType', this.linkType);
      this.compRef.setInput('listID', this.listID);
      this.compRef.changeDetectorRef.detectChanges();
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

}
