import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../../config/app-config.interface';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { RemoteData } from '../../../../../core/data/remote-data';
import { Context } from '../../../../../core/shared/context.model';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { ClaimedTask } from '../../../../../core/tasks/models/claimed-task-object.model';
import { ClaimedDeclinedTaskSearchResult } from '../../../../object-collection/shared/claimed-declined-task-search-result.model';
import { ClaimedTaskSearchResult } from '../../../../object-collection/shared/claimed-task-search-result.model';
import { listableObjectComponent } from '../../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { followLink } from '../../../../utils/follow-link-config.model';
import { VarDirective } from '../../../../utils/var.directive';
import { SearchResultListElementComponent } from '../../../search-result-list-element/search-result-list-element.component';
import { ThemedItemListPreviewComponent } from '../../item-list-preview/themed-item-list-preview.component';

/**
 * This component renders claimed task declined object for the search result in the list view.
 */
@Component({
  selector: 'ds-claimed-declined-search-result-list-element',
  styleUrls: ['../../../search-result-list-element/search-result-list-element.component.scss'],
  templateUrl: './claimed-declined-search-result-list-element.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    ThemedItemListPreviewComponent,
    TranslateModule,
    VarDirective,
  ],
})
@listableObjectComponent(ClaimedDeclinedTaskSearchResult, ViewMode.ListElement)
export class ClaimedDeclinedSearchResultListElementComponent extends SearchResultListElementComponent<ClaimedTaskSearchResult, ClaimedTask> implements OnInit {

  /**
   * A boolean representing if to show submitter information
   */
  public showSubmitter = true;

  /**
   * Represents the badge context
   */
  public badgeContext = Context.MyDSpaceDeclined;

  /**
   * The workflowitem object that belonging to the result object
   */
  public workflowitemRD$: Observable<RemoteData<WorkflowItem>>;

  public constructor(
    protected linkService: LinkService,
    protected truncatableService: TruncatableService,
    public dsoNameService: DSONameService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super(truncatableService, dsoNameService, appConfig);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.linkService.resolveLinks(this.dso,
      followLink('workflowitem',
        { useCachedVersionIfAvailable: false },
        followLink('item'),
        followLink('submitter'),
      ),
      followLink('action'));
    this.workflowitemRD$ = this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>;
  }

}
