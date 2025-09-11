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
import {
  NgbModal,
  NgbTooltipModule,
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
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';

import { AuthService } from '../../../core/auth/auth.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestService } from '../../../core/data/request.service';
import { Item } from '../../../core/shared/item.model';
import { NoContent } from '../../../core/shared/NoContent.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import { SearchService } from '../../../core/shared/search/search.service';
import { WorkspaceItem } from '../../../core/submission/models/workspaceitem.model';
import { WorkspaceitemDataService } from '../../../core/submission/workspaceitem-data.service';
import { getWorkspaceItemViewRoute } from '../../../workspaceitems-edit-page/workspaceitems-edit-page-routing-paths';
import { NotificationsService } from '../../notifications/notifications.service';
import { MyDSpaceActionsComponent } from '../mydspace-actions';

/**
 * This component represents actions related to WorkspaceItem object.
 */
@Component({
  selector: 'ds-workspaceitem-actions',
  styleUrls: ['./workspaceitem-actions.component.scss'],
  templateUrl: './workspaceitem-actions.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgbTooltipModule,
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
      },
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
