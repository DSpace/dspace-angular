import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import { getGroupEditRoute } from '../../../../../access-control/access-control-routing-paths';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { RemoteData } from '../../../../../core/data/remote-data';
import { RequestService } from '../../../../../core/data/request.service';
import { GroupDataService } from '../../../../../core/eperson/group-data.service';
import { Group } from '../../../../../core/eperson/models/group.model';
import { Collection } from '../../../../../core/shared/collection.model';
import { Community } from '../../../../../core/shared/community.model';
import { HALLink } from '../../../../../core/shared/hal-link.model';
import { NoContent } from '../../../../../core/shared/NoContent.model';
import {
  getAllCompletedRemoteData,
  getFirstCompletedRemoteData,
} from '../../../../../core/shared/operators';
import { AlertComponent } from '../../../../alert/alert.component';
import { ConfirmationModalComponent } from '../../../../confirmation-modal/confirmation-modal.component';
import {
  hasNoValue,
  hasValue,
} from '../../../../empty.util';
import { ThemedLoadingComponent } from '../../../../loading/themed-loading.component';
import { NotificationsService } from '../../../../notifications/notifications.service';
import { HasNoValuePipe } from '../../../../utils/has-no-value.pipe';
import { VarDirective } from '../../../../utils/var.directive';

/**
 * Component for managing a community or collection role.
 */
@Component({
  selector: 'ds-comcol-role',
  styleUrls: ['./comcol-role.component.scss'],
  templateUrl: './comcol-role.component.html',
  imports: [
    AlertComponent,
    AsyncPipe,
    HasNoValuePipe,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
export class ComcolRoleComponent implements OnInit {

  /**
   * The community or collection to manage.
   */
  @Input()
  dso: Community | Collection;

  /**
   * The role to manage
   */
  comcolRole$: BehaviorSubject<HALLink> = new BehaviorSubject(undefined);

  /**
   * The group for this role, as an observable remote data.
   */
  groupRD$: Observable<RemoteData<Group>>;

  /**
   * The group for this role, as an observable.
   */
  group$: Observable<Group>;

  /**
   * The link to the group edit page as an observable.
   */
  editGroupLink$: Observable<string>;

  /**
   * True if there is no group for this ComcolRole.
   */
  hasNoGroup$: Observable<boolean>;

  /**
   * Return true if the group for this ComcolRole is the Anonymous group, as an observable.
   */
  hasAnonymousGroup$: Observable<boolean>;

  /**
   * Return true if there is a group for this ComcolRole other than the Anonymous group, as an observable.
   */
  hasCustomGroup$: Observable<boolean>;

  /**
   * The human-readable name of this role
   */
  roleName$: Observable<string>;

  constructor(
    protected requestService: RequestService,
    protected groupService: GroupDataService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    public dsoNameService: DSONameService,
    private modalService: NgbModal,
  ) {
  }

  /**
   * The link to the related group.
   */
  get groupLink(): string {
    return this.comcolRole.href;
  }

  /**
   * The role to manage
   */
  @Input()
  set comcolRole(newRole: HALLink) {
    this.comcolRole$.next(newRole);
  }

  get comcolRole(): HALLink {
    return this.comcolRole$.getValue();
  }

  /**
   * Create a group for this community or collection role.
   */
  create() {
    this.groupService.createComcolGroup(this.dso, this.comcolRole.name, this.groupLink).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((rd: RemoteData<Group>) => {

      if (rd.hasSucceeded) {
        this.groupService.clearGroupsRequests();
        this.requestService.setStaleByHrefSubstring(this.comcolRole.href);
      } else {
        this.notificationsService.error(
          this.roleName$.pipe(
            switchMap(role => this.translateService.get('comcol-role.edit.create.error.title', { role })),
          ),
          `${rd.statusCode} ${rd.errorMessage}`,
        );
      }
    });
  }

  /**
   * Delete the group for this community or collection role.
   */
  delete() {
    this.groupService.deleteComcolGroup(this.groupLink).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((rd: RemoteData<NoContent>) => {
      if (rd.hasSucceeded) {
        this.groupService.clearGroupsRequests();
        this.requestService.setStaleByHrefSubstring(this.comcolRole.href);
      } else {
        this.notificationsService.error(
          this.roleName$.pipe(
            switchMap(role => this.translateService.get('comcol-role.edit.delete.error.title', { role })),
          ),
          rd.errorMessage,
        );
      }
    });
  }

  ngOnInit(): void {
    this.groupRD$ = this.comcolRole$.pipe(
      filter((role: HALLink) => hasValue(role)),
      switchMap((role: HALLink) => this.groupService.findByHref(role.href)),
      getAllCompletedRemoteData(),
    );

    this.group$ = this.groupRD$.pipe(
      map((rd: RemoteData<Group>) => {
        if (hasValue(rd.payload)) {
          return rd.payload;
        } else {
          return undefined;
        }
      }),
    );

    this.editGroupLink$ = this.group$.pipe(
      map((group: Group) => hasValue(group) ? getGroupEditRoute(group.id) : undefined),
    );

    this.hasNoGroup$ = this.group$.pipe(
      map((group: Group) => hasNoValue(group)),
    );

    this.hasAnonymousGroup$ = this.group$.pipe(
      map((group: Group) => hasValue(group) && group.name === 'Anonymous'),
    );

    this.hasCustomGroup$ = this.group$.pipe(
      map((group: Group) => hasValue(group) && group.name !== 'Anonymous'),
    );

    this.roleName$ = this.translateService.get(`comcol-role.edit.${this.comcolRole.name}.name`);
  }

  confirmDelete(groupName: string): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.name = groupName;
    modalRef.componentInstance.headerLabel = 'comcol-role.edit.delete.modal.header';
    modalRef.componentInstance.infoLabel = 'comcol-role.edit.delete.modal.info';
    modalRef.componentInstance.cancelLabel = 'comcol-role.edit.delete.modal.cancel';
    modalRef.componentInstance.confirmLabel = 'comcol-role.edit.delete.modal.confirm';
    modalRef.componentInstance.brandColor = 'danger';
    modalRef.componentInstance.confirmIcon = 'fas fa-trash';

    const modalSub: Subscription = modalRef.componentInstance.response.pipe(
      takeUntil(modalRef.closed),
    ).subscribe((result: boolean) => {
      if (result === true) {
        this.delete();
      }
    });

    void modalRef.result.then().finally(() => {
      modalRef.close();
      if (modalSub && !modalSub.closed) {
        modalSub.unsubscribe();
      }
    });
  }
}
