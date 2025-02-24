import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
  Context,
  DSONameService,
  followLink,
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
  Item,
  LinkService,
  RemoteData,
  ViewMode,
  WorkflowItem,
  WorkflowItemSearchResult,
} from '@dspace/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';

import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ListableObjectComponentLoaderComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { SearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/search-result-list-element.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { WorkflowItemAdminWorkflowActionsComponent } from '../../actions/workflow-item/workflow-item-admin-workflow-actions.component';

@listableObjectComponent(WorkflowItemSearchResult, ViewMode.ListElement, Context.AdminWorkflowSearch)
@Component({
  selector: 'ds-workflow-item-search-result-admin-workflow-list-element',
  styleUrls: ['./workflow-item-search-result-admin-workflow-list-element.component.scss'],
  templateUrl: './workflow-item-search-result-admin-workflow-list-element.component.html',
  standalone: true,
  imports: [ListableObjectComponentLoaderComponent, WorkflowItemAdminWorkflowActionsComponent, AsyncPipe, TranslateModule],
})
/**
 * The component for displaying a list element for a workflow item on the admin workflow search page
 */
export class WorkflowItemSearchResultAdminWorkflowListElementComponent extends SearchResultListElementComponent<WorkflowItemSearchResult, WorkflowItem> implements OnInit {

  /**
   * The item linked to the workflow item
   */
  public item$: BehaviorSubject<Item> = new BehaviorSubject<Item>(undefined);

  constructor(private linkService: LinkService,
              protected truncatableService: TruncatableService,
              public dsoNameService: DSONameService,
              @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super(truncatableService, dsoNameService, appConfig);
  }

  /**
   * Initialize the item object from the workflow item
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.dso = this.linkService.resolveLink(this.dso, followLink('item'));
    (this.dso.item as Observable<RemoteData<Item>>).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload())
      .subscribe((item: Item) => {
        this.item$.next(item);
      });
  }
}
