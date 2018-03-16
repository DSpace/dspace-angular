import { MetadataRegistryComponent } from './metadata-registry.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MetadataRegistryService } from '../../../core/metadata/metadataregistry.service';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('MetadataRegistryComponent', () => {
  let comp: MetadataRegistryComponent;
  let fixture: ComponentFixture<MetadataRegistryComponent>;
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
  const mockSchemas = Observable.of(new RemoteData(false, false, true, undefined, new PaginatedList(null, mockSchemasList)));
  const metadataRegistryServiceStub = {
    getMetadataSchemas: () => mockSchemas
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot()],
      declarations: [MetadataRegistryComponent],
      providers: [
        { provide: MetadataRegistryService, useValue: metadataRegistryServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataRegistryComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    fixture.detectChanges();
    metadataRegistryService = (comp as any).service;
  });

  it('should contain two schemas', () => {
    let tbody: HTMLElement = fixture.debugElement.query(By.css('#metadata-schemas>tbody')).nativeElement;
    // Expecting 3 rows, because one row is invisible
    expect(tbody.children.length).toBe(3);
  });

  it('should contain the correct schemas', () => {
    // Second row, because one row is invisible
    let dcName: HTMLElement = fixture.debugElement.query(By.css('#metadata-schemas tr:nth-child(2) td:nth-child(2)')).nativeElement;
    expect(dcName.textContent).toBe('dc');

    // Third row, because one row is invisible
    let mockName: HTMLElement = fixture.debugElement.query(By.css('#metadata-schemas tr:nth-child(3) td:nth-child(2)')).nativeElement;
    expect(mockName.textContent).toBe('mock');
  });

});
