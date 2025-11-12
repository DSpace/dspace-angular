import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Context } from '@dspace/core/shared/context.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import { WorkflowItemSearchResult } from '@dspace/core/shared/object-collection/workflow-item-search-result.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '@dspace/core/shared/operators';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { WorkflowItem } from '@dspace/core/submission/models/workflowitem.model';
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
  imports: [
    AsyncPipe,
    ListableObjectComponentLoaderComponent,
    TranslateModule,
    WorkflowItemAdminWorkflowActionsComponent,
  ],
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
