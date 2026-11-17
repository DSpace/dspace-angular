import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OpfDataResponse } from '@dspace/core/testing/section-opf-policies.service.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { ContentAccordionComponent } from './content-accordion.component';

describe('ContentAccordionComponent', () => {
  let component: ContentAccordionComponent;
  let fixture: ComponentFixture<ContentAccordionComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        NgbCollapseModule,
        ContentAccordionComponent,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentAccordionComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.isCollapsed = false;
    component.version = OpfDataResponse.opfResponse.journals[0].policies[0].permittedVersions[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show 2 rows', () => {
    component.version = OpfDataResponse.opfResponse.journals[0].policies[0].permittedVersions[0];
    fixture.detectChanges();
    expect(de.queryAll(By.css('.row')).length).toEqual(2);
  });

  it('should show 5 rows', () => {
    component.version = OpfDataResponse.opfResponse.journals[0].policies[0].permittedVersions[2];
    fixture.detectChanges();
    expect(de.queryAll(By.css('.row')).length).toEqual(5);
  });

  it('should show additional OA fee icon when additionalOpenAccessFee is true', () => {
    component.version = OpfDataResponse.opfResponse.journals[0].policies[0].permittedVersions[0];
    (component.version as any).additionalOpenAccessFee = true;
    fixture.detectChanges();
    expect(de.query(By.css('.fa-dollar-sign'))).toBeTruthy();
  });

  it('should not show additional OA fee icon when additionalOpenAccessFee is false', () => {
    component.version = OpfDataResponse.opfResponse.journals[0].policies[0].permittedVersions[0];
    (component.version as any).additionalOpenAccessFee = false;
    fixture.detectChanges();
    expect(de.query(By.css('.fa-dollar-sign'))).toBeFalsy();
  });

  it('should not show additional OA fee icon when additionalOpenAccessFee is missing', () => {
    component.version = OpfDataResponse.opfResponse.journals[0].policies[0].permittedVersions[0];
    delete (component.version as any).additionalOpenAccessFee;
    fixture.detectChanges();
    expect(de.query(By.css('.fa-dollar-sign'))).toBeFalsy();
  });
});
