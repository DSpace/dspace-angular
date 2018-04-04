import { MetadataSchemaComponent } from './metadata-schema.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { MetadataSchema } from '../../../core/metadata/metadataschema.model';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MockTranslateLoader } from '../../../shared/testing/mock-translate-loader';
import { RegistryService } from '../../../core/registry/registry.service';
import { SharedModule } from '../../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnumKeysPipe } from '../../../shared/utils/enum-keys-pipe';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service-stub';
import { HostWindowService } from '../../../shared/host-window.service';
import { RouterStub } from '../../../shared/testing/router-stub';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from '../../../shared/testing/active-router-stub';

fdescribe('MetadataSchemaComponent', () => {
  let comp: MetadataSchemaComponent;
  let fixture: ComponentFixture<MetadataSchemaComponent>;
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
  const mockFieldsList = [
    {
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/8',
      element: 'contributor',
      qualifier: 'advisor',
      scopenote: null,
      schema: mockSchemasList[0]
    },
    {
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/9',
      element: 'contributor',
      qualifier: 'author',
      scopenote: null,
      schema: mockSchemasList[0]
    },
    {
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/10',
      element: 'contributor',
      qualifier: 'editor',
      scopenote: 'test scope note',
      schema: mockSchemasList[1]
    },
    {
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/11',
      element: 'contributor',
      qualifier: 'illustrator',
      scopenote: null,
      schema: mockSchemasList[1]
    }
  ];
  const mockSchemas = Observable.of(new RemoteData(false, false, true, undefined, new PaginatedList(null, mockSchemasList)));
  const registryServiceStub = {
    getMetadataSchemas: () => mockSchemas,
    getMetadataFieldsBySchema: (schema: MetadataSchema) => Observable.of(new RemoteData(false, false, true, undefined, new PaginatedList(null, mockFieldsList.filter((value) => value.schema === schema)))),
    getMetadataSchemaByName: (schemaName: string) => Observable.of(new RemoteData(false, false, true, undefined, mockSchemasList.filter((value) => value.prefix === schemaName)[0]))
  };
  const schemaNameParam = 'mock';
  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: Observable.of({
      schemaName: schemaNameParam
    })
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [MetadataSchemaComponent, PaginationComponent, EnumKeysPipe],
      providers: [
        { provide: RegistryService, useValue: registryServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
        { provide: Router, useValue: new RouterStub() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataSchemaComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    registryService = (comp as any).service;
  });

  it('should contain the schema prefix in the header', () => {
    const header: HTMLElement = fixture.debugElement.query(By.css('.metadata-schema #header')).nativeElement;
    expect(header.textContent).toContain('mock');
  });

  it('should contain two fields', () => {
    const tbody: HTMLElement = fixture.debugElement.query(By.css('#metadata-fields>tbody')).nativeElement;
    expect(tbody.children.length).toBe(2);
  });

  it('should contain the correct fields', () => {
    const editorField: HTMLElement = fixture.debugElement.query(By.css('#metadata-fields tr:nth-child(1) td:nth-child(1)')).nativeElement;
    expect(editorField.textContent).toBe('mock.contributor.editor');

    const illustratorField: HTMLElement = fixture.debugElement.query(By.css('#metadata-fields tr:nth-child(2) td:nth-child(1)')).nativeElement;
    expect(illustratorField.textContent).toBe('mock.contributor.illustrator');
  });
});
