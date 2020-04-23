import { Component, Input, OnInit } from '@angular/core';
import { Group } from '../../../../core/eperson/models/group.model';
import { Community } from '../../../../core/shared/community.model';
import { Observable } from 'rxjs';
import { getGroupEditPath } from '../../../../+admin/admin-access-control/admin-access-control-routing.module';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { Collection } from '../../../../core/shared/collection.model';
import { filter, map } from 'rxjs/operators';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../core/shared/operators';
import { ComcolRole } from './comcol-role';
import { RequestService } from '../../../../core/data/request.service';
import { RemoteData } from '../../../../core/data/remote-data';

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
  dso: Community|Collection;

  /**
   * The role to manage
   */
  @Input()
  comcolRole: ComcolRole;

  constructor(
    protected requestService: RequestService,
    protected groupService: GroupDataService,
  ) {
  }

  /**
   * The link to the related group.
   */
  get groupLink(): string {
    return this.dso._links[this.comcolRole.linkName].href;
  }

  /**
   * The group for this role, as an observable remote data.
   */
  get groupRD$(): Observable<RemoteData<Group>> {
    return this.groupService.findByHref(this.groupLink).pipe(
      filter((groupRD) => !!groupRD.statusCode),
    );
  }

  /**
   * The group for this role, as an observable.
   */
  get group$(): Observable<Group> {
    return this.groupRD$.pipe(
      getSucceededRemoteData(),
      filter((groupRD) => groupRD != null),
      getRemoteDataPayload(),
    );
  }

  /**
   * The link to the group edit page as an observable.
   */
  get editGroupLink$(): Observable<string> {
    return this.group$.pipe(
      map((group) => getGroupEditPath(group.id)),
    );
  }

  /**
   * Return true if there is no group for this ComcolRole, as an observable.
   */
  hasNoGroup$(): Observable<boolean> {
    return this.groupRD$.pipe(
      map((groupRD) => groupRD.statusCode === 204),
    )
  }

  /**
   * Return true if the group for this ComcolRole is the Anonymous group, as an observable.
   */
  hasAnonymousGroup$(): Observable<boolean> {
    return this.group$.pipe(
      map((group) => group.name === 'Anonymous'),
    )
  }

  /**
   * Return true if there is a group for this ComcolRole other than the Anonymous group, as an observable.
   */
  hasCustomGroup$(): Observable<boolean> {
    return this.hasAnonymousGroup$().pipe(
      map((anonymous) => !anonymous),
    )
  }

  /**
   * Create a group for this community or collection role.
   */
  create() {
    this.groupService.createComcolGroup(this.dso, this.groupLink).subscribe();
  }

  /**
   * Delete the group for this community or collection role.
   */
  delete() {
    this.groupService.deleteComcolGroup(this.groupLink).subscribe();
  }

  ngOnInit(): void {
    this.requestService.hasByHrefObservable(this.groupLink)
      .pipe(
        filter((hasByHrefObservable) => !hasByHrefObservable),
      )
      .subscribe(() => this.groupRD$.subscribe());
  }
}
