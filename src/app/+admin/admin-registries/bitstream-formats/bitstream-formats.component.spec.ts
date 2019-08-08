import { BitstreamFormatsComponent } from './bitstream-formats.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistryService } from '../../../core/registry/registry.service';
import { of as observableOf } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnumKeysPipe } from '../../../shared/utils/enum-keys-pipe';
import { HostWindowService } from '../../../shared/host-window.service';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service-stub';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/testing/utils';

describe('BitstreamFormatsComponent', () => {
  let comp: BitstreamFormatsComponent;
  let fixture: ComponentFixture<BitstreamFormatsComponent>;
  let registryService: RegistryService;
  const mockFormatsList = [
    {
      shortDescription: 'Unknown',
      description: 'Unknown data format',
      mimetype: 'application/octet-stream',
      supportLevel: 0,
      internal: false,
      extensions: null
    },
    {
      shortDescription: 'License',
      description: 'Item-specific license agreed upon to submission',
      mimetype: 'text/plain; charset=utf-8',
      supportLevel: 1,
      internal: true,
      extensions: null
    },
    {
      shortDescription: 'CC License',
      description: 'Item-specific Creative Commons license agreed upon to submission',
      mimetype: 'text/html; charset=utf-8',
      supportLevel: 2,
      internal: true,
      extensions: null
    },
    {
      shortDescription: 'Adobe PDF',
      description: 'Adobe Portable Document Format',
      mimetype: 'application/pdf',
      supportLevel: 0,
      internal: false,
      extensions: null
    }
  ];
  const mockFormats = createSuccessfulRemoteDataObject$(new PaginatedList(null, mockFormatsList));
  const registryServiceStub = {
    getBitstreamFormats: () => mockFormats
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [BitstreamFormatsComponent, PaginationComponent, EnumKeysPipe],
      providers: [
        { provide: RegistryService, useValue: registryServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BitstreamFormatsComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    registryService = (comp as any).service;
  });

  it('should contain four formats', () => {
    const tbody: HTMLElement = fixture.debugElement.query(By.css('#formats>tbody')).nativeElement;
    expect(tbody.children.length).toBe(4);
  });

  it('should contain the correct formats', () => {
    const unknownName: HTMLElement = fixture.debugElement.query(By.css('#formats tr:nth-child(1) td:nth-child(1)')).nativeElement;
    expect(unknownName.textContent).toBe('Unknown');

    const licenseName: HTMLElement = fixture.debugElement.query(By.css('#formats tr:nth-child(2) td:nth-child(1)')).nativeElement;
    expect(licenseName.textContent).toBe('License');

    const ccLicenseName: HTMLElement = fixture.debugElement.query(By.css('#formats tr:nth-child(3) td:nth-child(1)')).nativeElement;
    expect(ccLicenseName.textContent).toBe('CC License');

    const adobeName: HTMLElement = fixture.debugElement.query(By.css('#formats tr:nth-child(4) td:nth-child(1)')).nativeElement;
    expect(adobeName.textContent).toBe('Adobe PDF');
  });

});
