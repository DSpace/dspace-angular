import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { HealthInfoResponseObj } from '../../shared/mocks/health-endpoint.mocks';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { ObjNgFor } from '../../shared/utils/object-ngfor.pipe';
import { HealthInfoComponent } from './health-info.component';

describe('HealthInfoComponent', () => {
  let component: HealthInfoComponent;
  let fixture: ComponentFixture<HealthInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgbAccordionModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        HealthInfoComponent,
        ObjNgFor,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthInfoComponent);
    component = fixture.componentInstance;
    component.healthInfoResponse = HealthInfoResponseObj;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create info component properly', () => {
    const components = fixture.debugElement.queryAll(By.css('[data-test="info-component"]'));
    expect(components.length).toBe(7);
  });
});
