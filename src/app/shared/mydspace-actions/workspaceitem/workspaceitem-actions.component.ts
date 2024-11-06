import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Item } from '../../../core/shared/item.model';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { WorkspaceItem } from '../../../core/submission/models/workspaceitem.model';
import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { WorkspaceitemDataService } from '../../../core/submission/workspaceitem-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { RequestService } from '../../../core/data/request.service';
import { SearchService } from '../../../core/shared/search/search.service';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { NoContent } from '../../../core/shared/NoContent.model';
import { getWorkspaceItemViewRoute } from '../../../workspaceitems-edit-page/workspaceitems-edit-page-routing-paths';
import { GetRequest } from '../../../core/data/request.models';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';

/**
 * This component represents actions related to WorkspaceItem object.
 */
@Component({
  selector: 'ds-workspaceitem-actions',
  styleUrls: ['./workspaceitem-actions.component.scss'],
  templateUrl: './workspaceitem-actions.component.html',
})
export class WorkspaceitemActionsComponent extends MyDSpaceActionsComponent<WorkspaceItem, WorkspaceitemDataService> implements OnInit {

  /**
   * The workspaceitem object
   */
  @Input() object: WorkspaceItem;

  /**
   * A boolean representing if a share operation is pending. It is used to show/hide the spinner.
   */
  shareSubmissionSpinner = false;

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
   * @param {SearchService} searchService
   * @param {RequestService} requestService
   */
  constructor(protected injector: Injector,
    protected router: Router,
    protected modalService: NgbModal,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected searchService: SearchService,
    protected requestService: RequestService,
    private authService: AuthService,
    public authorizationService: AuthorizationDataService,
    protected halService: HALEndpointService,
    protected rdbService: RemoteDataBuildService,
    ) {
    super(WorkspaceItem.type, injector, router, notificationsService, translate, searchService, requestService);

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
      }
    );
  }


  ngOnInit(): void {
    const activeEPerson$ = this.authService.getAuthenticatedUserFromStore();

    this.canEditItem$ = activeEPerson$.pipe(
      switchMap((eperson) => {
        return this.object?.item.pipe(
          getFirstCompletedRemoteData(),
          getRemoteDataPayload(),
          switchMap((item: Item) => {
            return this.authorizationService.isAuthorized(FeatureID.CanEditItem, item?._links?.self.href, eperson.uuid);
          })
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

  /**
   * Share the submission. This will send a GET request to the backend to get a share link.
   * When the link is received, the user will be redirected to the share-submission page.
   */
  shareSubmission() {
    const requestId = this.requestService.generateRequestId();

    const url = this.halService.getRootHref() + '/submission/share?workspaceitemid=' + this.object.id;
    const getRequest = new GetRequest(requestId, url);
    // Send GET request
    this.requestService.send(getRequest);
    // Get response
    const response = this.rdbService.buildFromRequestUUID(requestId);
    // Show spinner
    this.shareSubmissionSpinner = true;
    response.pipe(getFirstCompletedRemoteData()).subscribe((rd: RemoteData<ShareSubmissionLink>) => {
      // If the request has succeeded
      if (rd.hasSucceeded) {
        // Show success notification
        this.notificationsService.success(
          this.translate.instant('submission.workflow.share-submission.email.successful'));
        // Redirect to share-submission page
        void this.router.navigate(['/share-submission'], { queryParams: {
          changeSubmitterLink: rd.payload?.shareLink
        }});
      } else {
        // Show error notification
        this.notificationsService.error(
          this.translate.instant('submission.workflow.share-submission.email.error'));
      }
      this.shareSubmissionSpinner = false;
    });
  }
}

/**
 * This interface represents the response of the share submission endpoint. It contains the share link.
 */
export interface ShareSubmissionLink {
  shareLink: string;
}
