import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Group } from '../../../../core/eperson/models/group.model';
import { Community } from '../../../../core/shared/community.model';
import { EMPTY, Observable } from 'rxjs';
import { getGroupEditPath } from '../../../../+admin/admin-access-control/admin-access-control-routing.module';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { Collection } from '../../../../core/shared/collection.model';
import { map } from 'rxjs/operators';
import { followLink } from '../../../utils/follow-link-config.model';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../core/shared/operators';
import { ComcolRole } from './comcol-role';
import { RequestService } from '../../../../core/data/request.service';

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
    protected groupService: GroupDataService,
    protected linkService: LinkService,
    protected cdr: ChangeDetectorRef,
    protected requestService: RequestService,
  ) {
  }

  /**
   * The group for this role as an observable.
   */
  get group$(): Observable<Group> {

    if (!this.dso[this.comcolRole.linkName]) {
      return EMPTY;
    }

    return this.dso[this.comcolRole.linkName].pipe(
      getSucceededRemoteData(),
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
   * Create a group for this community or collection role.
   */
  create() {

    this.groupService.createComcolGroup(this.dso, this.comcolRole)
      .subscribe(() => {
        this.linkService.resolveLink(this.dso, followLink(this.comcolRole.linkName));
        this.cdr.detectChanges();
      });
  }

  /**
   * Delete the group for this community or collection role.
   */
  delete() {
    this.groupService.deleteComcolGroup(this.dso, this.comcolRole)
      .subscribe(() => {
        this.cdr.detectChanges();
      })
  }

  ngOnInit(): void {
    this.linkService.resolveLink(this.dso, followLink(this.comcolRole.linkName));
  }
}
