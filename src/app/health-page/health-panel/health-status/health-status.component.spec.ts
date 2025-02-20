import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { HealthStatus } from '../../models/health-component.model';
import { HealthStatusComponent } from './health-status.component';

describe('HealthStatusComponent', () => {
  let component: HealthStatusComponent;
  let fixture: ComponentFixture<HealthStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgbTooltipModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        HealthStatusComponent,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create success icon', () => {
    component.status = HealthStatus.UP;
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('i.text-success'));
    expect(icon).toBeTruthy();
  });

  it('should create warning icon', () => {
    component.status = HealthStatus.UP_WITH_ISSUES;
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('i.text-warning'));
    expect(icon).toBeTruthy();
  });

  it('should create success icon', () => {
    component.status = HealthStatus.DOWN;
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('i.text-danger'));
    expect(icon).toBeTruthy();
  });
});
