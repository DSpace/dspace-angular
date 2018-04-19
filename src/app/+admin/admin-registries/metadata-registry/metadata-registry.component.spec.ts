import { MetadataRegistryComponent } from './metadata-registry.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistryService } from '../../../core/registry/registry.service';
import { SharedModule } from '../../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnumKeysPipe } from '../../../shared/utils/enum-keys-pipe';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service-stub';
import { HostWindowService } from '../../../shared/host-window.service';

describe('MetadataRegistryComponent', () => {
  let comp: MetadataRegistryComponent;
  let fixture: ComponentFixture<MetadataRegistryComponent>;
  let registryService: RegistryService;
  const mockSchemasList = [
    {
      id: 1,
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/1',
      prefix: 'dc',
      namespace: 'http://dublincore.org/documents/dcmi-terms/'
    },
    {
      id: 2,
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/2',
      prefix: 'mock',
      namespace: 'http://dspace.org/mockschema'
    }
  ];
  const mockSchemas = Observable.of(new RemoteData(false, false, true, undefined, new PaginatedList(null, mockSchemasList)));
  const registryServiceStub = {
    getMetadataSchemas: () => mockSchemas
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [MetadataRegistryComponent, PaginationComponent, EnumKeysPipe],
      providers: [
        { provide: RegistryService, useValue: registryServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataRegistryComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    registryService = (comp as any).service;
  });

  it('should contain two schemas', () => {
    const tbody: HTMLElement = fixture.debugElement.query(By.css('#metadata-schemas>tbody')).nativeElement;
    expect(tbody.children.length).toBe(2);
  });

  it('should contain the correct schemas', () => {
    const dcName: HTMLElement = fixture.debugElement.query(By.css('#metadata-schemas tr:nth-child(1) td:nth-child(3)')).nativeElement;
    expect(dcName.textContent).toBe('dc');

    const mockName: HTMLElement = fixture.debugElement.query(By.css('#metadata-schemas tr:nth-child(2) td:nth-child(3)')).nativeElement;
    expect(mockName.textContent).toBe('mock');
  });

});
