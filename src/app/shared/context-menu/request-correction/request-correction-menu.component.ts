import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  of as observableOf,
  Subscription,
} from 'rxjs';
import {
  catchError,
  switchMap,
  take,
} from 'rxjs/operators';
import { BtnDisabledDirective } from 'src/app/shared/btn-disabled.directive';

import { ErrorResponse } from '../../../core/cache/response.models';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { SubmissionObject } from '../../../core/submission/models/submission-object.model';
import { SubmissionService } from '../../../submission/submission.service';
import {
  hasValue,
  isNotEmpty,
} from '../../empty.util';
import { NotificationsService } from '../../notifications/notifications.service';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { ContextMenuEntryType } from '../context-menu-entry-type';

/**
 * This component renders a context menu option that provides the request a correction functionality.
 */
@Component({
  selector: 'ds-context-menu-request-correction',
  templateUrl: './request-correction-menu.component.html',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TranslateModule,
    BtnDisabledDirective,
  ],
})
export class RequestCorrectionMenuComponent extends ContextMenuEntryComponent implements OnDestroy {

  canCreateCorrection$: Observable<boolean>;
  /**
   * A boolean representing if a request operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processing$ = new BehaviorSubject<boolean>(false);

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  /**
   * Variable to track subscription and unsubscribe it onDestroy
   */
  private sub: Subscription;
  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {NgbModal} modalService
   * @param {NotificationsService} notificationService
   * @param {Router} router
   * @param {SubmissionService} submissionService
   * @param {TranslateService} translate
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    private authorizationService: AuthorizationDataService,
    private modalService: NgbModal,
    private notificationService: NotificationsService,
    private router: Router,
    private submissionService: SubmissionService,
    private translate: TranslateService,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.RequestCorrection);
  }

  /**
   * Open modal
   *
   * @param content
   */
  public openRequestModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  /**
   * Request a correction for the item
   */
  public requestCorrection() {
    this.processing$.next(true);
    this.sub = this.submissionService.createSubmissionByItem(this.contextMenuObject.id, 'isCorrectionOfItem').pipe(
      take(1),
      catchError((error: unknown) => {
        if (error instanceof ErrorResponse) {
          this.handleErrorResponse(error.statusCode);
          return observableOf({});
        }
      }),
    ).subscribe((response: SubmissionObject) => {
      this.processing$.next(false);
      this.modalRef.close();

      if (isNotEmpty(response)) {
        this.notificationService.success(
          null,
          this.translate.instant('submission.workflow.tasks.generic.success'),
        );
        // redirect to workspaceItem edit page
        this.router.navigate(['workspaceitems', response.id, 'edit']);
      }
    });

    this.canCreateCorrection$ = this.notificationService.claimedProfile.pipe(
      switchMap(() => this.canCreateCorrection(false)),
    );
  }

  /**
   * Return a boolean representing if user can create a correction
   */
  public canCreateCorrection(useCacheVersion = true): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanCorrectItem, this.contextMenuObject.self, null,  useCacheVersion);
  }

  /**
   * Handle notification messages for an error response
   *
   * @param errorCode
   *    The http status code of the error response
   */
  private handleErrorResponse(errorCode: number) {
    switch (errorCode) {
      case 403:
        this.notificationService.warning(
          null,
          this.translate.instant('context-menu.actions.request-correction.error.403'),
        );
        break;
      case 422:
        this.notificationService.warning(
          null,
          this.translate.instant('context-menu.actions.request-correction.error.422'),
        );
        break;
      default :
        this.notificationService.error(
          null,
          this.translate.instant('context-menu.actions.request-correction.error.generic'),
        );
    }
  }

  /**
   * Make sure the subscription is unsubscribed from when this component is destroyed
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

}
