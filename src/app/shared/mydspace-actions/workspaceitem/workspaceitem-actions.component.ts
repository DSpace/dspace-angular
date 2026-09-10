import { AsyncPipe } from '@angular/common';
import {
  Component,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { AuthService } from '@dspace/core/auth/auth.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { RemoteData } from '@dspace/core/data/remote-data';
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import { NoContent } from '@dspace/core/shared/NoContent.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '@dspace/core/shared/operators';
import { WorkspaceItem } from '@dspace/core/submission/models/workspaceitem.model';
import { WorkspaceitemDataService } from '@dspace/core/submission/workspaceitem-data.service';
import {
  NgbModal,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  switchMap,
} from 'rxjs';

import { getWorkspaceItemViewRoute } from '../../../workspaceitems-edit-page/workspaceitems-edit-page-routing-paths';
import { SearchResultsDataService } from '../../search/services/search-results.data.service';
import { MyDSpaceActionsComponent } from '../mydspace-actions';

/**
 * This component represents actions related to WorkspaceItem object.
 */
@Component({
  selector: 'ds-workspaceitem-actions',
  styleUrls: ['./workspaceitem-actions.component.scss'],
  templateUrl: './workspaceitem-actions.component.html',
  imports: [
    AsyncPipe,
    NgbTooltip,
    RouterLink,
    TranslateModule,
  ],
})
export class WorkspaceitemActionsComponent extends MyDSpaceActionsComponent<WorkspaceItem, WorkspaceitemDataService> implements OnInit {

  /**
   * The workspaceitem object
   */
  @Input() object: WorkspaceItem;

  /**
   * A boolean representing if a delete operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processingDelete$ = new BehaviorSubject<boolean>(false);

  /**
   * A boolean representing if the user can edit the item
   * and therefore can delete it as well
   * (since the user can discard the item also from the edit page)
   * @type {Observable<boolean>}
   */
  canEditItem$: Observable<boolean>;

  /**
   * Initialize instance variables
   *
   * @param {Injector} injector
   * @param {Router} router
   * @param {NgbModal} modalService
   * @param {NotificationsService} notificationsService
   * @param {TranslateService} translate
   * @param {SearchResultsDataService} searchResultsService
   * @param {RequestService} requestService
   */
  constructor(protected injector: Injector,
    protected router: Router,
    protected modalService: NgbModal,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected searchResultsService: SearchResultsDataService,
    protected requestService: RequestService,
    private authService: AuthService,
    public authorizationService: AuthorizationDataService,
    protected linkService: LinkService,
  ) {
    super(WorkspaceItem.type, injector, router, notificationsService, translate, searchResultsService, requestService);

  }

  /**
   * Delete the target workspaceitem object
   */
  public confirmDiscard(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.processingDelete$.next(true);
          this.objectDataService.delete(this.object.id)
            .pipe(getFirstCompletedRemoteData())
            .subscribe((response: RemoteData<NoContent>) => {
              this.processingDelete$.next(false);
              this.handleActionResponse(response.hasSucceeded);
            });
        }
      },
    );
  }


  ngOnInit(): void {
    const activeEPerson$ = this.authService.getAuthenticatedUserFromStore();

    this.canEditItem$ = activeEPerson$.pipe(
      switchMap((eperson) => {
        return this.linkService.resolveLinkWithoutAttaching(this.object, followLink('item')).pipe(
          getFirstCompletedRemoteData(),
          getRemoteDataPayload(),
          switchMap((item: Item) => {
            return this.authorizationService.isAuthorized(FeatureID.CanEditItem, item?._links?.self.href, eperson.uuid);
          }),
        ) as Observable<boolean>;
      }));
  }

  /**
   * Init the target object
   *
   * @param {WorkspaceItem} object
   */
  initObjects(object: WorkspaceItem) {
    this.object = object;
  }

  /**
   * Get the workflowitem view route.
   */
  getWorkspaceItemViewRoute(workspaceItem: WorkspaceItem): string {
    return getWorkspaceItemViewRoute(workspaceItem?.id);
  }
}
