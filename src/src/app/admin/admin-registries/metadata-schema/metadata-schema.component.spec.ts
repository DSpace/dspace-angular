import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { buildPaginatedList } from '../../../core/data/paginated-list.model';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { MetadataField } from '../../../core/metadata/metadata-field.model';
import { MetadataSchema } from '../../../core/metadata/metadata-schema.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { RegistryService } from '../../../core/registry/registry.service';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { HostWindowService } from '../../../shared/host-window.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service.stub';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { RegistryServiceStub } from '../../../shared/testing/registry.service.stub';
import { SearchConfigurationServiceStub } from '../../../shared/testing/search-configuration-service.stub';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { EnumKeysPipe } from '../../../shared/utils/enum-keys-pipe';
import { VarDirective } from '../../../shared/utils/var.directive';
import { MetadataFieldFormComponent } from './metadata-field-form/metadata-field-form.component';
import { MetadataSchemaComponent } from './metadata-schema.component';

describe('MetadataSchemaComponent', () => {
  let comp: MetadataSchemaComponent;
  let fixture: ComponentFixture<MetadataSchemaComponent>;

  let registryService: RegistryServiceStub;
  let activatedRoute: ActivatedRouteStub;
  let paginationService: PaginationServiceStub;

  const mockSchemasList: MetadataSchema[] = [
    {
      id: 1,
      _links: {
        self: {
          href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/1',
        },
      },
      prefix: 'dc',
      namespace: 'http://dublincore.org/documents/dcmi-terms/',
    },
    {
      id: 2,
      _links: {
        self: {
          href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/2',
        },
      },
      prefix: 'mock',
      namespace: 'http://dspace.org/mockschema',
    },
  ] as MetadataSchema[];
  const mockFieldsList: MetadataField[] = [
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
      schema: createSuccessfulRemoteDataObject$(mockSchemasList[0]),
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
      schema: createSuccessfulRemoteDataObject$(mockSchemasList[0]),
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
      schema: createSuccessfulRemoteDataObject$(mockSchemasList[1]),
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
      schema: createSuccessfulRemoteDataObject$(mockSchemasList[1]),
    },
  ] as MetadataField[];
  const schemaNameParam = 'mock';

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
      name: 'test',
      values: [
        'org.dspace.ctask.general.ProfileFormats = test',
      ],
    })),
  });

  const groupDataService = jasmine.createSpyObj('groupsDataService', {
    findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    getGroupRegistryRouterLink: '',
    getUUIDFromString: '',
  });


  beforeEach(waitForAsync(() => {
    activatedRoute = new ActivatedRouteStub({
      schemaName: schemaNameParam,
    });
    paginationService = new PaginationServiceStub();
    registryService = new RegistryServiceStub();
    spyOn(registryService, 'getMetadataFieldsBySchema').and.returnValue(createSuccessfulRemoteDataObject$(buildPaginatedList(null, mockFieldsList.filter((value) => value.id === 3 || value.id === 4))));
    spyOn(registryService, 'getMetadataSchemaByPrefix').and.callFake((schemaName) => createSuccessfulRemoteDataObject$(mockSchemasList.filter((value) => value.prefix === schemaName)[0]));

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        NgbModule,
        MetadataSchemaComponent,
        PaginationComponent,
        EnumKeysPipe,
        VarDirective,
      ],
      providers: [
        { provide: RegistryService, useValue: registryService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
        { provide: PaginationService, useValue: paginationService },
        {
          provide: NotificationsService,
          useValue: new NotificationsServiceStub(),
        },
        { provide: GroupDataService, useValue: groupDataService },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: SearchConfigurationService, useValue: new SearchConfigurationServiceStub()  },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(MetadataSchemaComponent, {
        remove: {
          imports: [MetadataFieldFormComponent],
        },
      })
      .compileComponents();
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
    const editorField: HTMLElement = fixture.debugElement.query(By.css('#metadata-fields tr:nth-child(1) td:nth-child(3)')).nativeElement;
    expect(editorField.textContent).toBe('mock.contributor.editor');

    const illustratorField: HTMLElement = fixture.debugElement.query(By.css('#metadata-fields tr:nth-child(2) td:nth-child(3)')).nativeElement;
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

    it('should start editing the selected field', waitForAsync(() => {
      fixture.whenStable().then(() => {
        expect(registryService.editMetadataField).toHaveBeenCalledWith(mockFieldsList[2] as MetadataField);
      });
    }));

    it('should cancel editing the selected field when clicked again', waitForAsync(() => {
      comp.activeField$ = of(mockFieldsList[2] as MetadataField);
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
      comp.selectedMetadataFieldIDs$ = of(selectedFields.map((metadataField: MetadataField) => metadataField.id));
      comp.deleteFields();
      fixture.detectChanges();
    });

    it('should call deleteMetadataField with the selected id', waitForAsync(() => {
      fixture.whenStable().then(() => {
        expect(registryService.deleteMetadataField).toHaveBeenCalledWith(selectedFields[0].id);
      });
    }));
  });
});
