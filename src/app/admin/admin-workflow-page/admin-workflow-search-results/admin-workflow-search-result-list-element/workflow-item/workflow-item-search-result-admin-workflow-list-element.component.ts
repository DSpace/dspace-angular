import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../../config/app-config.interface';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { RemoteData } from '../../../../../core/data/remote-data';
import { Context } from '../../../../../core/shared/context.model';
import { Item } from '../../../../../core/shared/item.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../../../../../core/shared/operators';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ListableObjectComponentLoaderComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { WorkflowItemSearchResult } from '../../../../../shared/object-collection/shared/workflow-item-search-result.model';
import { SearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/search-result-list-element.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { followLink } from '../../../../../shared/utils/follow-link-config.model';
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
