import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Context } from '@dspace/core';

import { DSONameService } from '@dspace/core';
import { LinkService } from '@dspace/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/core';
import { followLink } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { ClaimedApprovedTaskSearchResult } from '@dspace/core';
import { ClaimedTaskSearchResult } from '@dspace/core';
import { ViewMode } from '@dspace/core';
import { WorkflowItem } from '@dspace/core';
import { ClaimedTask } from '@dspace/core';
import { listableObjectComponent } from '../../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { VarDirective } from '../../../../utils/var.directive';
import { SearchResultListElementComponent } from '../../../search-result-list-element/search-result-list-element.component';
import { ThemedItemListPreviewComponent } from '../../item-list-preview/themed-item-list-preview.component';

/**
 * This component renders claimed task approved object for the search result in the list view.
 */
@Component({
  selector: 'ds-claimed-approved-search-result-list-element',
  styleUrls: ['../../../search-result-list-element/search-result-list-element.component.scss'],
  templateUrl: './claimed-approved-search-result-list-element.component.html',
  standalone: true,
  imports: [ThemedItemListPreviewComponent, AsyncPipe, TranslateModule, VarDirective],
})
@listableObjectComponent(ClaimedApprovedTaskSearchResult, ViewMode.ListElement)
export class ClaimedApprovedSearchResultListElementComponent extends SearchResultListElementComponent<ClaimedTaskSearchResult, ClaimedTask> implements OnInit {

  /**
   * A boolean representing if to show submitter information
   */
  public showSubmitter = true;

  /**
   * Represents the badge context
   */
  public badgeContext = Context.MyDSpaceApproved;

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
      followLink('action'),
    );
    this.workflowitemRD$ = this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>;
  }

}
