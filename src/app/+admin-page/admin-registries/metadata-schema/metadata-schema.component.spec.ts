import { MetadataSchemaComponent } from './metadata-schema.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MetadataRegistryService } from '../../../core/metadata/metadataregistry.service';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { MetadataSchema } from '../../../core/metadata/metadataschema.model';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('MetadataSchemaComponent', () => {
  let comp: MetadataSchemaComponent;
  let fixture: ComponentFixture<MetadataSchemaComponent>;
  let metadataRegistryService: MetadataRegistryService;
  const mockSchemasList = [
    {
      "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/1",
      "prefix": "dc",
      "namespace": "http://dublincore.org/documents/dcmi-terms/"
    },
    {
      "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/2",
      "prefix": "mock",
      "namespace": "http://dspace.org/mockschema"
    }
  ];
  const mockFieldsList = [
    {
      "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/8",
      "element": "contributor",
      "qualifier": "advisor",
      "scopenote": null,
      "schema": mockSchemasList[0]
    },
    {
      "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/9",
      "element": "contributor",
      "qualifier": "author",
      "scopenote": null,
      "schema": mockSchemasList[0]
    },
    {
      "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/10",
      "element": "contributor",
      "qualifier": "editor",
      "scopenote": "test scope note",
      "schema": mockSchemasList[1]
    },
    {
      "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/11",
      "element": "contributor",
      "qualifier": "illustrator",
      "scopenote": null,
      "schema": mockSchemasList[1]
    }
  ];
  const mockSchemas = Observable.of(new RemoteData(false, false, true, undefined, new PaginatedList(null, mockSchemasList)));
  const metadataRegistryServiceStub = {
    getMetadataSchemas: () => mockSchemas,
    getMetadataFieldsBySchema: (schema: MetadataSchema) => Observable.of(new RemoteData(false, false, true, undefined, new PaginatedList(null, mockFieldsList.filter((value) => value.schema == schema)))),
    getMetadataSchemaByName: (schemaName: string) => Observable.of(new RemoteData(false, false, true, undefined, mockSchemasList.filter((value) => value.prefix == schemaName)[0]))
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
        { provide: MetadataRegistryService, useValue: metadataRegistryServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataSchemaComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    fixture.detectChanges();
    metadataRegistryService = (comp as any).service;
  });

  it('should contain the schema prefix in the header', () => {
    let header: HTMLElement = fixture.debugElement.query(By.css('.metadata-schema #header')).nativeElement;
    expect(header.textContent).toContain('mock');
  });

  it('should contain the schema namespace in the description', () => {
    let description: HTMLElement = fixture.debugElement.query(By.css('.metadata-schema #description')).nativeElement;
    expect(description.textContent).toContain('http://dspace.org/mockschema');
  });

  it('should contain two fields', () => {
    let tbody: HTMLElement = fixture.debugElement.query(By.css('#metadata-fields>tbody')).nativeElement;
    // Expecting 3 rows, because one row is invisible
    expect(tbody.children.length).toBe(3);
  });

  it('should contain the correct fields', () => {
    // Second row, because one row is invisible
    let editorField: HTMLElement = fixture.debugElement.query(By.css('#metadata-fields tr:nth-child(2) td:nth-child(1)')).nativeElement;
    expect(editorField.textContent).toBe('mock.contributor.editor');

    // Third row, because one row is invisible
    let illustratorField: HTMLElement = fixture.debugElement.query(By.css('#metadata-fields tr:nth-child(3) td:nth-child(1)')).nativeElement;
    expect(illustratorField.textContent).toBe('mock.contributor.illustrator');
  });
});
