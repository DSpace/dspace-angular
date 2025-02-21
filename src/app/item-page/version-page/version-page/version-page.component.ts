import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { getPageNotFoundRoute } from '../../../app-routing-paths';
import { AuthService } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { VersionDataService } from '@dspace/core';
import { redirectOn4xx } from '@dspace/core';
import { Item } from '@dspace/core';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '@dspace/core';
import { Version } from '@dspace/core';
import { getItemPageRoute } from '../../item-page-routing-paths';

@Component({
  selector: 'ds-version-page',
  templateUrl: './version-page.component.html',
  styleUrls: ['./version-page.component.scss'],
  standalone: true,
})
export class VersionPageComponent implements OnInit {

  versionRD$: Observable<RemoteData<Version>>;
  itemRD$: Observable<RemoteData<Item>>;

  constructor(
    protected route: ActivatedRoute,
    private router: Router,
    private versionService: VersionDataService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    /* Retrieve version from resolver or redirect on 4xx */
    this.versionRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Version>),
      redirectOn4xx(this.router, this.authService),
    );

    /* Retrieve item from version and reroute to item's page or handle missing item */
    this.versionRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((version) => version.item),
      redirectOn4xx(this.router, this.authService),
      getFirstCompletedRemoteData(),
    ).subscribe((itemRD: RemoteData<Item>) => {
      if (itemRD.hasNoContent) {
        this.router.navigateByUrl(getPageNotFoundRoute(), { skipLocationChange: true });
      } else {
        const itemUrl = getItemPageRoute(itemRD.payload);
        this.router.navigateByUrl(itemUrl);
      }
    });

  }

}
