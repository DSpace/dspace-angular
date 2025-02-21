import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  first,
  map,
} from 'rxjs/operators';

import { RemoteData } from '../../../../../modules/core/src/lib/core/data/remote-data';
import { Community } from '../../../../../modules/core/src/lib/core/shared/community.model';
import { HALLink } from '../../../../../modules/core/src/lib/core/shared/hal-link.model';
import {
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../../../../../modules/core/src/lib/core/shared/operators';
import { ComcolRoleComponent } from '../../../shared/comcol/comcol-forms/edit-comcol-page/comcol-role/comcol-role.component';

/**
 * Component for managing a community's roles
 */
@Component({
  selector: 'ds-community-roles',
  templateUrl: './community-roles.component.html',
  imports: [
    ComcolRoleComponent,
    AsyncPipe,
  ],
  standalone: true,
})
export class CommunityRolesComponent implements OnInit {

  dsoRD$: Observable<RemoteData<Community>>;

  /**
   * The different roles for the community, as an observable.
   */
  comcolRoles$: Observable<HALLink[]>;

  /**
   * The community to manage, as an observable.
   */
  community$: Observable<Community>;

  constructor(
    protected route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.dsoRD$ = this.route.parent.data.pipe(
      first(),
      map((data) => data.dso),
    );

    this.community$ = this.dsoRD$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    );

    /**
     * The different roles for the community.
     */
    this.comcolRoles$ = this.community$.pipe(
      map((community) => [
        {
          name: 'community-admin',
          href: community._links.adminGroup.href,
        },
      ]),
    );
  }
}
