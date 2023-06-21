import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarinLicenseInfoComponent } from './clarin-license-info.component';
import { DomSanitizer } from '@angular/platform-browser';
import { mockLicenseRD$ } from '../../shared/testing/clarin-license-mock';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarinLicenseDataService } from '../../core/data/clarin/clarin-license-data.service';
import { ItemMock } from '../../shared/mocks/item.mock';
import { MetadataValue } from '../../core/shared/metadata.models';

const item = ItemMock;
const license = 'Test License Name';
const licenseLabel = 'Test PUB';
const licenseURI = 'Test URI';

describe('ClarinLicenseInfoComponent', () => {
  let component: ClarinLicenseInfoComponent;
  let fixture: ComponentFixture<ClarinLicenseInfoComponent>;

  let clarinLicenseDataService: ClarinLicenseDataService;
  let sanitizerStub: DomSanitizer;

  // initialize license metadata
  item.metadata['dc.rights.label'] = [Object.assign(new MetadataValue(), {
      key: 'dc.rights.label',
      value: licenseLabel
    })];

  item.metadata['dc.rights'] = [Object.assign(new MetadataValue(), {
      key: 'dc.rights',
      value: license
    })];

  item.metadata['dc.rights.uri'] = [Object.assign(new MetadataValue(), {
      key: 'dc.rights.uri',
      value: licenseURI
    })];

  beforeEach(async () => {
    clarinLicenseDataService = jasmine.createSpyObj('clarinLicenseService', {
      searchBy: mockLicenseRD$
    });
    sanitizerStub = jasmine.createSpyObj('sanitizer', {
      bypassSecurityTrustUrl: null
    });

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ ClarinLicenseInfoComponent ],
      providers: [
        { provide: ClarinLicenseDataService, useValue: clarinLicenseDataService },
        { provide: DomSanitizer, useValue: sanitizerStub },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClarinLicenseInfoComponent);
    component = fixture.componentInstance;
    component.item = item;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load license data', () => {
    expect(component.license).toEqual(license);
    expect(component.licenseLabel).toEqual(licenseLabel);
    expect(component.licenseURI).toEqual(licenseURI);
  });

  it('should load license label icons', () => {
    expect(component.licenseLabelIcons.length).toEqual(1);
  });
});
