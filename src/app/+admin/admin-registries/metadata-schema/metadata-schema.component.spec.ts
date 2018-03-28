import { MetadataSchemaComponent } from './metadata-schema.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { MetadataSchema } from '../../../core/metadata/metadataschema.model';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MockTranslateLoader } from '../../../shared/testing/mock-translate-loader';
import { RegistryService } from '../../../core/registry/registry.service';

describe('MetadataSchemaComponent', () => {
  let comp: MetadataSchemaComponent;
  let fixture: ComponentFixture<MetadataSchemaComponent>;
  let registryService: RegistryService;
  const mockSchemasList = [
    {
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/1',
      prefix: 'dc',
      namespace: 'http://dublincore.org/documents/dcmi-terms/'
    },
    {
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
  const activatedRouteStub = {
    params: Observable.of({
      schemaName: schemaNameParam
    })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot()],
      declarations: [MetadataSchemaComponent],
      providers: [
        { provide: RegistryService, useValue: registryServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
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
