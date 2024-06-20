import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClarinSponsorItemFieldComponent } from './clarin-sponsor-item-field.component';
import { mockItemWithMetadataFieldsAndValue } from '../specific-field/item-page-field.component.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { VarDirective } from '../../../../shared/utils/var.directive';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../shared/testing/translate-loader.mock';

describe('ClarinSponsorItemFieldComponent', () => {
  let component: ClarinSponsorItemFieldComponent;
  let fixture: ComponentFixture<ClarinSponsorItemFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [ClarinSponsorItemFieldComponent, VarDirective],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ClarinSponsorItemFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render EU fund', async () => {
    const PROJECT_CODE = 'EU project code';
    const ORGANIZATION = 'EU organization';
    const PROJECT_NAME = 'EU project name';
    const EU_FUND = `EU;${PROJECT_CODE};${ORGANIZATION};${PROJECT_NAME};info:eu-repo/grantAgreement/test/test/test/EU`;
    component.item = mockItemWithMetadataFieldsAndValue(['local.sponsor'], EU_FUND);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#organization-value')).nativeElement.textContent).toContain(ORGANIZATION);
    expect(fixture.debugElement.query(By.css('#project-code-value')).nativeElement.textContent).toContain(PROJECT_CODE);
    expect(fixture.debugElement.query(By.css('#project-name-value')).nativeElement.textContent).toContain(PROJECT_NAME);
  });

  it('should render national fund', () => {
    const PROJECT_CODE = 'nationalFund project code';
    const ORGANIZATION = 'nationalFund organization';
    const PROJECT_NAME = 'nationalFund project name';
    const NATIONAL_FUND = `nationalFund;${PROJECT_CODE};${ORGANIZATION};${PROJECT_NAME};info:eu-repo/grantAgreement/test/test/test/EU`;

    component.item = mockItemWithMetadataFieldsAndValue(['local.sponsor'], NATIONAL_FUND) as any;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#organization-value')).nativeElement.textContent).toContain(ORGANIZATION);
    expect(fixture.debugElement.query(By.css('#project-code-value')).nativeElement.textContent).toContain(PROJECT_CODE);
    expect(fixture.debugElement.query(By.css('#project-name-value')).nativeElement.textContent).toContain(PROJECT_NAME);
  });
});
