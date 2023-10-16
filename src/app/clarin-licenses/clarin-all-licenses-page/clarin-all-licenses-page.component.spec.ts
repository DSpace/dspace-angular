import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClarinAllLicensesPageComponent } from './clarin-all-licenses-page.component';
import { createdLicenseRD$, mockLicenseRD$ } from '../../shared/testing/clarin-license-mock';
import { of as observableOf } from 'rxjs';
import { ClarinLicenseDataService } from '../../core/data/clarin/clarin-license-data.service';
import { TranslateModule } from '@ngx-translate/core';

describe('ClarinAllLicensesPageComponent', () => {
  let component: ClarinAllLicensesPageComponent;
  let fixture: ComponentFixture<ClarinAllLicensesPageComponent>;
  let clarinLicenseDataService: ClarinLicenseDataService;

  beforeEach(async () => {
    clarinLicenseDataService = jasmine.createSpyObj('clarinLicenseService', {
      findAll: mockLicenseRD$,
      create: createdLicenseRD$,
      put: createdLicenseRD$,
      searchBy: mockLicenseRD$,
      getLinkPath: observableOf('')
    });

    await TestBed.configureTestingModule({
      declarations: [ ClarinAllLicensesPageComponent ],
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: ClarinLicenseDataService, useValue: clarinLicenseDataService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClarinAllLicensesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
