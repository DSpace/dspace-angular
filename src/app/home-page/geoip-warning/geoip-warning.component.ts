import {
  AsyncPipe,
  isPlatformBrowser,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import {
  HealthResponse,
  HealthStatus,
} from '@dspace/core/shared/health-component.model';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { HealthService } from '../../health-page/health.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertType } from '../../shared/alert/alert-type';

const DISMISSED_KEY = 'geoip-warning-dismissed';

/**
 * Component that displays a warning when the GeoLite database is not installed.
 * Only visible to administrators. Once dismissed, stays hidden for the browser session.
 */
@Component({
  selector: 'ds-geoip-warning',
  templateUrl: './geoip-warning.component.html',
  imports: [
    AlertComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class GeoIpWarningComponent implements OnInit {

  /**
   * Whether to show the GeoIP warning.
   */
  showWarning$: Observable<boolean>;

  readonly AlertType = AlertType;

  constructor(
    private authorizationService: AuthorizationDataService,
    private healthService: HealthService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && sessionStorage.getItem(DISMISSED_KEY)) {
      this.showWarning$ = of(false);
      return;
    }

    this.showWarning$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf).pipe(
      switchMap((isAdmin: boolean) => {
        if (!isAdmin) {
          return of(false);
        }
        return this.healthService.getHealth().pipe(
          take(1),
          map((data: any) => {
            const response: HealthResponse = data.payload;
            return response?.components?.geoIp?.status === HealthStatus.UP_WITH_ISSUES;
          }),
          catchError(() => of(false)),
        );
      }),
    );
  }

  /**
   * Dismiss the warning and remember it for the session.
   */
  onDismiss(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(DISMISSED_KEY, 'true');
    }
  }

}
