import { Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { getListableObjectComponent, listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../core/shared/context.model';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { getItemEditPath } from '../../../../../+item-page/item-page-routing.module';
import { URLCombiner } from '../../../../../core/url-combiner/url-combiner';
import {
  ITEM_EDIT_DELETE_PATH,
  ITEM_EDIT_MOVE_PATH,
  ITEM_EDIT_PRIVATE_PATH,
  ITEM_EDIT_PUBLIC_PATH,
  ITEM_EDIT_REINSTATE_PATH,
  ITEM_EDIT_WITHDRAW_PATH
} from '../../../../../+item-page/edit-item-page/edit-item-page.routing.module';
import { SearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/search-result-grid-element.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { GenericConstructor } from '../../../../../core/shared/generic-constructor';
import { ListableObjectDirective } from '../../../../../shared/object-collection/shared/listable-object/listable-object.directive';
import { PoolTaskSearchResult } from '../../../../../shared/object-collection/shared/pool-task-search-result.model';
import { PoolTask } from '../../../../../core/tasks/models/pool-task-object.model';
import { Observable } from 'rxjs';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../../../../../core/shared/operators';

@listableObjectComponent(PoolTaskSearchResult, ViewMode.GridElement, Context.AdminWorkflowSearch)
@Component({
  selector: 'ds-pool-task-admin-workflow-search-result-grid-element',
  styleUrls: ['./pool-task-admin-workflow-search-result-grid-element.component.scss'],
  templateUrl: './pool-task-admin-workflow-search-result-grid-element.component.html'
})
/**
 * The component for displaying a list element for an pool task search result on the admin search page
 */
export class PoolTaskAdminWorkflowSearchResultGridElementComponent extends SearchResultGridElementComponent<PoolTaskSearchResult, PoolTask> implements OnInit {
  public wfi$: Observable<WorkflowItem>;

  ngOnInit(): void {
    super.ngOnInit();
    this.wfi$ = (this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload());
  }
}
