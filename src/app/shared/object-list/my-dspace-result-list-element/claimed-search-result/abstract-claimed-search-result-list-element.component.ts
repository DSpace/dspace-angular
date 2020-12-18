import { Observable } from 'rxjs';

import { RemoteData } from '../../../../core/data/remote-data';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { ClaimedTaskSearchResult } from '../../../object-collection/shared/claimed-task-search-result.model';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';
import { followLink } from '../../../utils/follow-link-config.model';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';

/**
 * This component renders claimed task object for the search result in the list view.
 * The task can be claimed, claimed declined or claimed approved.
 */
export abstract class AbstractClaimedSearchResultListElementComponent extends SearchResultListElementComponent<ClaimedTaskSearchResult, ClaimedTask> {

  /**
   * A boolean representing if to show submitter information
   */
  public showSubmitter = true;

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.VALIDATION;

  /**
   * The workflowitem object that belonging to the result object
   */
  public workflowitemRD$: Observable<RemoteData<WorkflowItem>>;

  protected constructor(
    protected linkService: LinkService,
    protected truncatableService: TruncatableService
  ) {
    super(truncatableService);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    super.ngOnInit();
    this.linkService.resolveLinks(this.dso, followLink('workflowitem', null, true,
      followLink('item'), followLink('submitter')
    ), followLink('action'));
    this.workflowitemRD$ = this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>;
  }
}
