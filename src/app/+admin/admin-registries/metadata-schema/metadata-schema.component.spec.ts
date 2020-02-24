import { MetadataSchemaComponent } from './metadata-schema.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { PaginatedList } from '../../../core/data/paginated-list';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RegistryService } from '../../../core/registry/registry.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnumKeysPipe } from '../../../shared/utils/enum-keys-pipe';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service-stub';
import { HostWindowService } from '../../../shared/host-window.service';
import { RouterStub } from '../../../shared/testing/router-stub';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from '../../../shared/testing/active-router-stub';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service-stub';
import { RestResponse } from '../../../core/cache/response.models';
import { MetadataSchema } from '../../../core/metadata/metadata-schema.model';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/testing/utils';
import { MetadataField } from '../../../core/metadata/metadata-field.model';

describe('MetadataSchemaComponent', () => {
  let comp: MetadataSchemaComponent;
  let fixture: ComponentFixture<MetadataSchemaComponent>;
  let registryService: RegistryService;
  const mockSchemasList = [
    {
      id: 1,
      _links: {
        self: {
          href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/1',
        },
      },
      prefix: 'dc',
      namespace: 'http://dublincore.org/documents/dcmi-terms/'
    },
    {
      id: 2,
      _links: {
        self: {
          href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/2',
        },
      },
      prefix: 'mock',
      namespace: 'http://dspace.org/mockschema'
    }
  ];
  const mockFieldsList = [
    {
      id: 1,
      _links: {
        self: {
          href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/8',
        },
      },
      element: 'contributor',
      qualifier: 'advisor',
      scopeNote: null,
      schema: mockSchemasList[0]
    },
    {
      id: 2,
      _links: {
        self: {
          href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/9',
        },
      },
      element: 'contributor',
      qualifier: 'author',
      scopeNote: null,
      schema: mockSchemasList[0]
    },
    {
      id: 3,
      _links: {
        self: {
          href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/10',
        },
      },
      element: 'contributor',
      qualifier: 'editor',
      scopeNote: 'test scope note',
      schema: mockSchemasList[1]
    },
    {
      id: 4,
      _links: {
        self: {
          href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/11',
        },
      },
      element: 'contributor',
      qualifier: 'illustrator',
      scopeNote: null,
      schema: mockSchemasList[1]
    }
  ];
  const mockSchemas = createSuccessfulRemoteDataObject$(new PaginatedList(null, mockSchemasList));
  /* tslint:disable:no-empty */
  const registryServiceStub = {
    getMetadataSchemas: () => mockSchemas,
    getMetadataFieldsBySchema: (schema: MetadataSchema) => createSuccessfulRemoteDataObject$(new PaginatedList(null, mockFieldsList.filter((value) => value.schema === schema))),
    getMetadataSchemaByName: (schemaName: string) => createSuccessfulRemoteDataObject$(mockSchemasList.filter((value) => value.prefix === schemaName)[0]),
    getActiveMetadataField: () => observableOf(undefined),
    getSelectedMetadataFields: () => observableOf([]),
    editMetadataField: (schema) => {},
    cancelEditMetadataField: () => {},
    deleteMetadataField: () => observableOf(new RestResponse(true, 200, 'OK')),
    deselectAllMetadataField: () => {},
    clearMetadataFieldRequests: () => observableOf(undefined)
  };
  /* tslint:enable:no-empty */
  const schemaNameParam = 'mock';
  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: observableOf({
      schemaName: schemaNameParam
    })
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule],
      declarations: [MetadataSchemaComponent, PaginationComponent, EnumKeysPipe],
      providers: [
        { provide: RegistryService, useValue: registryServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
        { provide: Router, useValue: new RouterStub() },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataSchemaComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([RegistryService], (s) => {
    registryService = s;
  }));

  it('should contain the schema prefix in the header', () => {
    const header: HTMLElement = fixture.debugElement.query(By.css('.metadata-schema #header')).nativeElement;
    expect(header.textContent).toContain('mock');
  });

  it('should contain two fields', () => {
    const tbody: HTMLElement = fixture.debugElement.query(By.css('#metadata-fields>tbody')).nativeElement;
    expect(tbody.children.length).toBe(2);
  });

  it('should contain the correct fields', () => {
    const editorField: HTMLElement = fixture.debugElement.query(By.css('#metadata-fields tr:nth-child(1) td:nth-child(2)')).nativeElement;
    expect(editorField.textContent).toBe('mock.contributor.editor');

    const illustratorField: HTMLElement = fixture.debugElement.query(By.css('#metadata-fields tr:nth-child(2) td:nth-child(2)')).nativeElement;
    expect(illustratorField.textContent).toBe('mock.contributor.illustrator');
  });

  describe('when clicking a metadata field row', () => {
    let row: HTMLElement;

    beforeEach(() => {
      spyOn(registryService, 'editMetadataField');
      row = fixture.debugElement.query(By.css('.selectable-row')).nativeElement;
      row.click();
      fixture.detectChanges();
    });

    it('should start editing the selected field', async(() => {
      fixture.whenStable().then(() => {
        expect(registryService.editMetadataField).toHaveBeenCalledWith(mockFieldsList[2] as MetadataField);
      });
    }));

    it('should cancel editing the selected field when clicked again', async(() => {
      spyOn(registryService, 'getActiveMetadataField').and.returnValue(observableOf(mockFieldsList[2] as MetadataField));
      spyOn(registryService, 'cancelEditMetadataField');
      row.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(registryService.cancelEditMetadataField).toHaveBeenCalled();
      });
    }));
  });

  describe('when deleting metadata fields', () => {
    const selectedFields = Array(mockFieldsList[2]);

    beforeEach(() => {
      spyOn(registryService, 'deleteMetadataField').and.callThrough();
      spyOn(registryService, 'getSelectedMetadataFields').and.returnValue(observableOf(selectedFields as MetadataField[]));
      comp.deleteFields();
      fixture.detectChanges();
    });

    it('should call deleteMetadataField with the selected id', async(() => {
      fixture.whenStable().then(() => {
        expect(registryService.deleteMetadataField).toHaveBeenCalledWith(selectedFields[0].id);
      });
    }));
  });
});
