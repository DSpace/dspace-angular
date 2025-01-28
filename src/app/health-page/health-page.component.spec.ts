import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { RawRestResponse } from '../core/dspace-rest/raw-rest-response.model';
import {
  HealthInfoResponseObj,
  HealthResponseObj,
} from '../shared/mocks/health-endpoint.mocks';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { HealthService } from './health.service';
import { HealthPageComponent } from './health-page.component';

describe('HealthPageComponent', () => {
  let component: HealthPageComponent;
  let fixture: ComponentFixture<HealthPageComponent>;

  const healthService = jasmine.createSpyObj('healthDataService', {
    getHealth: jasmine.createSpy('getHealth'),
    getInfo: jasmine.createSpy('getInfo'),
  });

  const healthRestResponse$ = of({
    payload: HealthResponseObj,
    statusCode: 200,
    statusText: 'OK',
  } as RawRestResponse);

  const healthInfoRestResponse$ = of({
    payload: HealthInfoResponseObj,
    statusCode: 200,
    statusText: 'OK',
  } as RawRestResponse);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgbNavModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        HealthPageComponent,
      ],
      providers: [
        { provide: HealthService, useValue: healthService },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthPageComponent);
    component = fixture.componentInstance;
    healthService.getHealth.and.returnValue(healthRestResponse$);
    healthService.getInfo.and.returnValue(healthInfoRestResponse$);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create nav items properly', () => {
    const navItems = fixture.debugElement.queryAll(By.css('li.nav-item'));
    expect(navItems.length).toBe(2);
  });
});
