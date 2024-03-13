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
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { RestResponse } from '../../../core/cache/response.models';
import { buildPaginatedList } from '../../../core/data/paginated-list.model';
import { MetadataSchema } from '../../../core/metadata/metadata-schema.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { RegistryService } from '../../../core/registry/registry.service';
import { HostWindowService } from '../../../shared/host-window.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service.stub';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { EnumKeysPipe } from '../../../shared/utils/enum-keys-pipe';
import { MetadataRegistryComponent } from './metadata-registry.component';

describe('MetadataRegistryComponent', () => {
  let comp: MetadataRegistryComponent;
  let fixture: ComponentFixture<MetadataRegistryComponent>;
  let registryService: RegistryService;
  let paginationService;
  const mockSchemasList = [
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
  ];
  const mockSchemas = createSuccessfulRemoteDataObject$(buildPaginatedList(null, mockSchemasList));
  /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
  const registryServiceStub = {
    getMetadataSchemas: () => mockSchemas,
    getActiveMetadataSchema: () => observableOf(undefined),
    getSelectedMetadataSchemas: () => observableOf([]),
    editMetadataSchema: (schema) => {
    },
    cancelEditMetadataSchema: () => {
    },
    deleteMetadataSchema: () => observableOf(new RestResponse(true, 200, 'OK')),
    deselectAllMetadataSchema: () => {
    },
    clearMetadataSchemaRequests: () => observableOf(undefined),
  };
  /* eslint-enable no-empty, @typescript-eslint/no-empty-function */

  paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule],
      declarations: [MetadataRegistryComponent, PaginationComponent, EnumKeysPipe],
      providers: [
        { provide: RegistryService, useValue: registryServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
        { provide: PaginationService, useValue: paginationService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(MetadataRegistryComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
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
      spyOn(registryService, 'getActiveMetadataSchema').and.returnValue(observableOf(mockSchemasList[0] as MetadataSchema));
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
      spyOn(registryService, 'getSelectedMetadataSchemas').and.returnValue(observableOf(selectedSchemas as MetadataSchema[]));
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
