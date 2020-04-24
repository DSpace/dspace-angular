import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Community } from '../../../core/shared/community.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../core/shared/operators';
import { ComcolRole } from '../../../shared/comcol-forms/edit-comcol-page/comcol-role/comcol-role';
import { RemoteData } from '../../../core/data/remote-data';

/**
 * Component for managing a community's roles
 */
@Component({
  selector: 'ds-community-roles',
  templateUrl: './community-roles.component.html',
})
export class CommunityRolesComponent implements OnInit {

  dsoRD$: Observable<RemoteData<Community>>;

  /**
   * The community to manage, as an observable.
   */
  get community$(): Observable<Community> {
    return this.dsoRD$.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
    )
  }

  /**
   * The different roles for the community.
   */
  getComcolRoles(): ComcolRole[] {
    return [
      ComcolRole.COMMUNITY_ADMIN,
    ];
  }

  constructor(
    protected route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.dsoRD$ = this.route.parent.data.pipe(
      first(),
      map((data) => data.dso),
    );
  }
}
