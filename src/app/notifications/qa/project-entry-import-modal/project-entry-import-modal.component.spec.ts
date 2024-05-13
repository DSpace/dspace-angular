import { CommonModule } from '@angular/common';
import {
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  async,
  ComponentFixture,
  inject,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { buildPaginatedList } from '../../../core/data/paginated-list.model';
import { Item } from '../../../core/shared/item.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { SearchService } from '../../../core/shared/search/search.service';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import {
  ItemMockPid10,
  NotificationsMockDspaceObject,
  qualityAssuranceEventObjectMissingProjectFound,
} from '../../../shared/mocks/notifications.mock';
import { getMockSearchService } from '../../../shared/mocks/search-service.mock';
import { SelectableListService } from '../../../shared/object-list/selectable-list/selectable-list.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { createSuccessfulRemoteDataObject } from '../../../shared/remote-data.utils';
import { PaginatedSearchOptions } from '../../../shared/search/models/paginated-search-options.model';
import { ThemedSearchResultsComponent } from '../../../shared/search/search-results/themed-search-results.component';
import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { createTestComponent } from '../../../shared/testing/utils.test';
import {
  ImportType,
  ProjectEntryImportModalComponent,
} from './project-entry-import-modal.component';

const eventData = {
  event: qualityAssuranceEventObjectMissingProjectFound,
  id: qualityAssuranceEventObjectMissingProjectFound.id,
  title: qualityAssuranceEventObjectMissingProjectFound.title,
  hasProject: true,
  projectTitle: qualityAssuranceEventObjectMissingProjectFound.message.title,
  projectId: ItemMockPid10.id,
  handle: ItemMockPid10.handle,
  reason: null,
  isRunning: false,
};

const searchString = 'Test project to search';
const pagination = Object.assign(
  new PaginationComponentOptions(), {
    id: 'notifications-project-bound',
    pageSize: 3,
  },
);
const searchOptions = Object.assign(new PaginatedSearchOptions(
  {
    configuration: 'funding',
    query: searchString,
    pagination: pagination,
  },
));
const pageInfo = new PageInfo({
  elementsPerPage: 3,
  totalElements: 1,
  totalPages: 1,
  currentPage: 1,
});
const array = [
  NotificationsMockDspaceObject,
];
const paginatedList = buildPaginatedList(pageInfo, array);
const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);

describe('ProjectEntryImportModalComponent test suite', () => {
  let fixture: ComponentFixture<ProjectEntryImportModalComponent>;
  let comp: ProjectEntryImportModalComponent;
  let compAsAny: any;

  const modalStub = jasmine.createSpyObj('modal', ['close', 'dismiss']);
  const uuid = '123e4567-e89b-12d3-a456-426614174003';
  const searchServiceStub: any = getMockSearchService();


  beforeEach(async (() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        ProjectEntryImportModalComponent,
        TestComponent,
      ],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
        { provide: SearchService, useValue: searchServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: SelectableListService, useValue: jasmine.createSpyObj('selectableListService', ['deselect', 'select', 'deselectAll']) },
        ProjectEntryImportModalComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ProjectEntryImportModalComponent, {
        remove: {
          imports: [
            ThemedLoadingComponent,
            ThemedSearchResultsComponent,
            AlertComponent,
          ],
        },
      })
      .compileComponents().then();
  }));

  // First test to check the correct component creation
  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      searchServiceStub.search.and.returnValue(observableOf(paginatedListRD));
      const html = `
        <ds-project-entry-import-modal [externalSourceEntry]="eventData"></ds-project-entry-import-modal>`;
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create ProjectEntryImportModalComponent', inject([ProjectEntryImportModalComponent], (app: ProjectEntryImportModalComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('Main tests', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ProjectEntryImportModalComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;

    });

    describe('close', () => {
      it('should close the modal', () => {
        comp.close();
        expect(modalStub.close).toHaveBeenCalled();
      });
    });

    describe('search', () => {
      it('should call SearchService.search', () => {

        (searchServiceStub as any).search.and.returnValue(observableOf(paginatedListRD));
        comp.pagination = pagination;

        comp.search(searchString);
        expect(comp.searchService.search).toHaveBeenCalledWith(searchOptions);
      });
    });

    describe('bound', () => {
      it('should call close, deselectAllLists and importedObject.emit', () => {
        spyOn(comp, 'deselectAllLists');
        spyOn(comp, 'close');
        spyOn(comp.importedObject, 'emit');
        comp.selectedEntity = NotificationsMockDspaceObject;
        comp.bound();

        expect(comp.importedObject.emit).toHaveBeenCalled();
        expect(comp.deselectAllLists).toHaveBeenCalled();
        expect(comp.close).toHaveBeenCalled();
      });
    });

    describe('selectEntity', () => {
      const entity = Object.assign(new Item(), { uuid: uuid });
      beforeEach(() => {
        comp.selectEntity(entity);
      });

      it('should set selected entity', () => {
        expect(comp.selectedEntity).toBe(entity);
      });

      it('should set the import type to local entity', () => {
        expect(comp.selectedImportType).toEqual(ImportType.LocalEntity);
      });
    });

    describe('deselectEntity', () => {
      const entity = Object.assign(new Item(), { uuid: uuid });
      beforeEach(() => {
        comp.selectedImportType = ImportType.LocalEntity;
        comp.selectedEntity = entity;
        comp.deselectEntity();
      });

      it('should remove the selected entity', () => {
        expect(comp.selectedEntity).toBeUndefined();
      });

      it('should set the import type to none', () => {
        expect(comp.selectedImportType).toEqual(ImportType.None);
      });
    });

    describe('deselectAllLists', () => {
      it('should call SelectableListService.deselectAll', () => {
        comp.deselectAllLists();
        expect(compAsAny.selectService.deselectAll).toHaveBeenCalledWith(comp.entityListId);
        expect(compAsAny.selectService.deselectAll).toHaveBeenCalledWith(comp.authorityListId);
      });
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [CommonModule],
})
class TestComponent {
  eventData = eventData;
}
