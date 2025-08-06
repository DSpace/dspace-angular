import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { GroupDataService } from '@dspace/core/eperson/group-data.service';
import { MetadataSchema } from '@dspace/core/metadata/metadata-schema.model';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { ConfigurationProperty } from '@dspace/core/shared/configuration-property.model';
import { HostWindowServiceStub } from '@dspace/core/testing/host-window-service.stub';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { PaginationServiceStub } from '@dspace/core/testing/pagination-service.stub';
import { RegistryServiceStub } from '@dspace/core/testing/registry.service.stub';
import { SearchConfigurationServiceStub } from '@dspace/core/testing/search-configuration-service.stub';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FormBuilderService } from 'src/app/shared/form/builder/form-builder.service';

import { FormService } from '../../../shared/form/form.service';
import { getMockFormBuilderService } from '../../../shared/form/testing/form-builder-service.mock';
import { getMockFormService } from '../../../shared/form/testing/form-service.mock';
import { HostWindowService } from '../../../shared/host-window.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { SearchConfigurationService } from '../../../shared/search/search-configuration.service';
import { EnumKeysPipe } from '../../../shared/utils/enum-keys-pipe';
import { RegistryService } from '../registry/registry.service';
import { MetadataRegistryComponent } from './metadata-registry.component';
import { MetadataSchemaFormComponent } from './metadata-schema-form/metadata-schema-form.component';

describe('MetadataRegistryComponent', () => {
  let comp: MetadataRegistryComponent;
  let fixture: ComponentFixture<MetadataRegistryComponent>;

  let paginationService: PaginationServiceStub;
  let registryService: RegistryServiceStub;

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

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
      name: 'test',
      values: [
        'org.dspace.ctask.general.ProfileFormats = test',
      ],
    })),
  });

  const mockGroupService = jasmine.createSpyObj('groupService',
    {
    // findByHref: jasmine.createSpy('findByHref'),
    // findAll: jasmine.createSpy('findAll'),
    // searchGroups: jasmine.createSpy('searchGroups'),
      getUUIDFromString: jasmine.createSpy('getUUIDFromString'),
    },
    {
      linkPath: 'groups',
    },
  );

  beforeEach(waitForAsync(() => {
    paginationService = new PaginationServiceStub();
    registryService = new RegistryServiceStub();
    spyOn(registryService, 'getMetadataSchemas').and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList(mockSchemasList)));

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        NgbModule,
        MetadataRegistryComponent,
        PaginationComponent,
        EnumKeysPipe,
      ],
      providers: [
        { provide: RegistryService, useValue: registryService },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
        { provide: PaginationService, useValue: paginationService },
        {
          provide: NotificationsService,
          useValue: new NotificationsServiceStub(),
        },
        { provide: FormService, useValue: getMockFormService() },
        { provide: GroupDataService, useValue: mockGroupService },
        {
          provide: ConfigurationDataService,
          useValue: configurationDataService,
        },
        {
          provide: SearchConfigurationService,
          useValue: new SearchConfigurationServiceStub(),
        },
        { provide: FormBuilderService, useValue: getMockFormBuilderService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(MetadataRegistryComponent, {
        remove: {
          imports: [MetadataSchemaFormComponent, RouterLink],
        },
        add: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataRegistryComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([RegistryService], (s) => {
    registryService = s;
  }));

  it('should contain two schemas', () => {
    const tbody: HTMLElement = fixture.debugElement.query(By.css('#metadata-schemas>tbody')).nativeElement;
    expect(tbody.children.length).toBe(2);
  });

  it('should contain the correct schemas', () => {
    const dcName: HTMLElement = fixture.debugElement.query(By.css('#metadata-schemas tr:nth-child(1) td:nth-child(4)')).nativeElement;
    expect(dcName.textContent).toBe('dc');

    const mockName: HTMLElement = fixture.debugElement.query(By.css('#metadata-schemas tr:nth-child(2) td:nth-child(4)')).nativeElement;
    expect(mockName.textContent).toBe('mock');
  });

  describe('when clicking a metadata schema row', () => {
    let row: HTMLElement;

    beforeEach(() => {
      spyOn(registryService, 'editMetadataSchema');
      row = fixture.debugElement.query(By.css('.selectable-row')).nativeElement;
      row.click();
      fixture.detectChanges();
    });

    it('should start editing the selected schema', waitForAsync(() => {
      fixture.whenStable().then(() => {
        expect(registryService.editMetadataSchema).toHaveBeenCalledWith(mockSchemasList[0] as MetadataSchema);
      });
    }));

    it('should cancel editing the selected schema when clicked again', waitForAsync(() => {
      comp.activeMetadataSchema$ = of(mockSchemasList[0] as MetadataSchema);
      spyOn(registryService, 'cancelEditMetadataSchema');
      row.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(registryService.cancelEditMetadataSchema).toHaveBeenCalled();
      });
    }));
  });

  describe('when deleting metadata schemas', () => {
    const selectedSchemas = Array(mockSchemasList[0]);

    beforeEach(() => {
      spyOn(registryService, 'deleteMetadataSchema').and.callThrough();
      comp.selectedMetadataSchemaIDs$ = of(selectedSchemas.map((selectedSchema: MetadataSchema) => selectedSchema.id));
      comp.deleteSchemas();
      fixture.detectChanges();
    });

    it('should call deleteMetadataSchema with the selected id', waitForAsync(() => {
      fixture.whenStable().then(() => {
        expect(registryService.deleteMetadataSchema).toHaveBeenCalledWith(selectedSchemas[0].id);
      });
    }));
  });
});
