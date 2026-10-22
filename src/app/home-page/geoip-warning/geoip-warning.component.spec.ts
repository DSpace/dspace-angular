import { PLATFORM_ID } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { HealthStatus } from '@dspace/core/shared/health-component.model';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment.test';
import { HealthService } from '../../health-page/health.service';
import { GeoIpWarningComponent } from './geoip-warning.component';

describe('GeoIpWarningComponent', () => {
  let fixture: ComponentFixture<GeoIpWarningComponent>;
  let authorizationService: jasmine.SpyObj<AuthorizationDataService>;
  let healthService: jasmine.SpyObj<HealthService>;

  function setup(showGeoIpWarning: boolean, isAdmin: boolean, geoIpStatus: HealthStatus) {
    authorizationService = jasmine.createSpyObj('AuthorizationDataService', {
      isAuthorized: of(isAdmin),
    });
    healthService = jasmine.createSpyObj('HealthService', {
      getHealth: of({ payload: { status: HealthStatus.UP, components: { geoIp: { status: geoIpStatus } } } }),
    });

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TranslateModule.forRoot(), GeoIpWarningComponent],
      providers: [
        { provide: APP_CONFIG, useValue: { ...environment, homePage: { ...environment.homePage, showGeoIpWarning } } },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: HealthService, useValue: healthService },
        // Keep sessionStorage out of these tests
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    fixture = TestBed.createComponent(GeoIpWarningComponent);
    fixture.detectChanges();
  }

  function shownWarning(): boolean {
    let shown: boolean;
    fixture.componentInstance.showWarning$.subscribe((value) => shown = value);
    return shown;
  }

  it('should warn administrators when the GeoLite database is missing', () => {
    setup(true, true, HealthStatus.UP_WITH_ISSUES);
    expect(shownWarning()).toBeTrue();
  });

  it('should not warn when the GeoLite database is present', () => {
    setup(true, true, HealthStatus.UP);
    expect(shownWarning()).toBeFalse();
  });

  it('should not warn non-administrators or check the health endpoint for them', () => {
    setup(true, false, HealthStatus.UP_WITH_ISSUES);
    expect(shownWarning()).toBeFalse();
    expect(healthService.getHealth).not.toHaveBeenCalled();
  });

  it('should not warn or make any requests when disabled in the configuration', () => {
    setup(false, true, HealthStatus.UP_WITH_ISSUES);
    expect(shownWarning()).toBeFalse();
    expect(authorizationService.isAuthorized).not.toHaveBeenCalled();
    expect(healthService.getHealth).not.toHaveBeenCalled();
  });
});
