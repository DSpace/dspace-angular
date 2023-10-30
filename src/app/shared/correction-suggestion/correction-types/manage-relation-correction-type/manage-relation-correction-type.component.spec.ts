import { ThemeService } from './../../../theme-support/theme.service';

import { SearchModule } from './../../../search/search.module';
import { RouterMock } from './../../../mocks/router.mock';
import { NotificationsService } from './../../../notifications/notifications.service';
import { ItemDataService } from './../../../../core/data/item-data.service';
import { OpenaireBrokerEventRestService } from './../../../../core/openaire/broker/events/openaire-broker-event-rest.service';
import { Item } from './../../../../core/shared/item.model';
import { SelectableListService } from './../../../object-list/selectable-list/selectable-list.service';
import { OpenaireMockDspaceObject, getMockOpenaireBrokerEventRestService } from './../../../mocks/openaire.mock';
import { PaginatedSearchOptions } from './../../../search/models/paginated-search-options.model';
import { PaginationComponentOptions } from './../../../pagination/pagination-component-options.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRelationCorrectionTypeComponent } from './manage-relation-correction-type.component';
import { PageInfo } from './../../../../core/shared/page-info.model';
import { buildPaginatedList } from './../../../../core/data/paginated-list.model';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from './../../../../shared/remote-data.utils';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchService } from './../../../../core/shared/search/search.service';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MockActivatedRoute } from './../../../../shared/mocks/active-router.mock';
import { NotificationsServiceStub } from './../../../../shared/testing/notifications-service.stub';
import { getMockTranslateService } from './../../../../shared/mocks/translate.service.mock';
import { TranslateLoaderMock } from './../../../../shared/mocks/translate-loader.mock';
import { SearchServiceStub } from './../../../../shared/testing/search-service.stub';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getMockThemeService } from './../../../../shared/mocks/theme-service.mock';
import { ImportType } from './../../../../openaire/broker/project-entry-import-modal/project-entry-import-modal.component';

describe('ManageRelationCorrectionTypeComponent', () => {
  let component: ManageRelationCorrectionTypeComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<ManageRelationCorrectionTypeComponent>;

  const correctionTypeMock = {
    id: 'addpersonalpath',
    topic: '/DSPACEUSERS/RELATIONADD/PERSONALPATH',
    discoveryConfiguration: 'RELATION.PersonPath.Items',
    creationForm: 'manageRelation',
    type: 'correctiontype',
    _links: {
      self: {
        href: 'https://rest.api/discover/configurations/addpersonalpath',
      },
    },
  };

  const pagination = Object.assign(
    new PaginationComponentOptions(), {
    id: 'correction-suggestion-manage-relation',
    pageSize: 3
  }
  );

  const uuid = '123e4567-e89b-12d3-a456-426614174003';

  const searchOptions = Object.assign(new PaginatedSearchOptions(
    {
      configuration: 'RELATION.PersonPath.Items',
      scope: '123e4567-e89b-12d3-a456-426614174013',
      pagination: pagination
    }
  ));

  const pageInfo = new PageInfo({
    elementsPerPage: 3,
    totalElements: 1,
    totalPages: 1,
    currentPage: 1
  });

  const array = [
    OpenaireMockDspaceObject,
  ];
  const paginatedList = buildPaginatedList(pageInfo, array);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);

  const searchServiceStub = Object.assign(new SearchServiceStub(), {
    search: () => of(paginatedListRD),
  });

  const openaireBrokerEventRestServiceStub: any = getMockOpenaireBrokerEventRestService();

  const itemDataService = {
    findById: (id: string) => createSuccessfulRemoteDataObject$(new Item())
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageRelationCorrectionTypeComponent, TestComponent ],
      imports: [
        CommonModule,
        BrowserModule,
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        RouterTestingModule.withRoutes([]),
        SearchModule
      ],
      providers: [
        { provide: 'correctionTypeObjectProvider', useValue: correctionTypeMock },
        { provide: SearchService, useValue: searchServiceStub },
        { provide: OpenaireBrokerEventRestService, useValue: openaireBrokerEventRestServiceStub },
        { provide: SelectableListService, useValue: jasmine.createSpyObj('selectableListService', ['deselect', 'select', 'deselectAll']) },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: ItemDataService, useValue: itemDataService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: new RouterMock() },
        { provide: TranslateService, useValue: getMockTranslateService() },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRelationCorrectionTypeComponent);
    component = fixture.componentInstance;
    compAsAny = component as any;
    component.localEntitiesRD$ = createSuccessfulRemoteDataObject$(paginatedList);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('search', () => {
    it('should call SearchService.search', () => {
      (searchServiceStub as any).search.and.returnValue(of(paginatedListRD));
      component.pagination = pagination;
      component.search('');
      expect(compAsAny.searchService.search).toHaveBeenCalledWith(searchOptions);
    });
  });

  describe('selectEntity', () => {
    const entity = Object.assign(new Item(), { uuid: uuid });
    beforeEach(() => {
      component.selectEntity(entity);
    });
    it('should set selected entity', () => {
      expect(component.selectedEntity).toBe(entity);
    });
    it('should set the import type to local entity', () => {
      expect(component.selectedImportType).toEqual(ImportType.LocalEntity);
    });
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    compAsAny = null;
  });
});

@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

}
