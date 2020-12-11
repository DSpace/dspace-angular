import { Component, Input, OnInit } from '@angular/core';
import { Group } from '../../../../core/eperson/models/group.model';
import { Community } from '../../../../core/shared/community.model';
import { Observable } from 'rxjs';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { Collection } from '../../../../core/shared/collection.model';
import { map, switchMap } from 'rxjs/operators';
import {
  getFirstCompletedRemoteData,
  getAllCompletedRemoteData
} from '../../../../core/shared/operators';
import { RequestService } from '../../../../core/data/request.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { HALLink } from '../../../../core/shared/hal-link.model';
import { getGroupEditRoute } from '../../../../+admin/admin-access-control/admin-access-control-routing-paths';
import { hasValue, hasNoValue } from '../../../empty.util';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { NoContent } from '../../../../core/shared/NoContent.model';
import { filter } from 'rxjs/internal/operators/filter';

/**
 * Component for managing a community or collection role.
 */
@Component({
  selector: 'ds-comcol-role',
  styleUrls: ['./comcol-role.component.scss'],
  templateUrl: './comcol-role.component.html'
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
  groupRD$: Observable<RemoteData<Group>>

  /**
   * The group for this role, as an observable.
   */
  group$: Observable<Group>

  /**
   * The link to the group edit page as an observable.
   */
  editGroupLink$: Observable<string>

  /**
   * True if there is no group for this ComcolRole.
   */
  hasNoGroup$: Observable<boolean>

  /**
   * Return true if the group for this ComcolRole is the Anonymous group, as an observable.
   */
  hasAnonymousGroup$: Observable<boolean>

  /**
   * Return true if there is a group for this ComcolRole other than the Anonymous group, as an observable.
   */
  hasCustomGroup$: Observable<boolean>

  constructor(
    protected requestService: RequestService,
    protected groupService: GroupDataService,
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
      getFirstCompletedRemoteData()
    ).subscribe((rd: RemoteData<Group>) => {
      if (rd.hasSucceeded) {
        this.groupService.clearGroupsRequests();
        this.requestService.setStaleByHrefSubstring(this.comcolRole.href);
      } else {
        // TODO show error notification
      }
    });
  }

  /**
   * Delete the group for this community or collection role.
   */
  delete() {
    this.groupService.deleteComcolGroup(this.groupLink).pipe(
      getFirstCompletedRemoteData()
    ).subscribe((rd: RemoteData<NoContent>) => {
      if (rd.hasSucceeded) {
        this.groupService.clearGroupsRequests();
        this.requestService.setStaleByHrefSubstring(this.comcolRole.href);
      } else {
        // TODO show error notification
      }
    });
  }

  ngOnInit(): void {
    this.groupRD$ = this.comcolRole$.pipe(
      filter((role: HALLink) => hasValue(role)),
      switchMap((role: HALLink) => this.groupService.findByHref(role.href)),
      getAllCompletedRemoteData(),
    )

    this.group$ = this.groupRD$.pipe(
      map((rd: RemoteData<Group>) => {
        if (hasValue(rd.payload)) {
          return rd.payload
        } else {
          return undefined;
        }
      })
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
    )
  }
}
