import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  buildPaginatedList,
  createSuccessfulRemoteDataObject$,
  Item,
  ItemSearchResult,
  LookupRelationService,
  PaginatedSearchOptions,
  PaginationService,
  PaginationServiceStub,
  relatedRelationships,
  RelationshipDataService,
  RelationshipOptions,
  RelationshipType,
  SearchConfigurationService,
  SearchObjects,
  SearchService,
  SelectableListService,
} from '@dspace/core';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { ThemedSearchComponent } from '../../../../../search/themed-search.component';
import { VarDirective } from '../../../../../utils/var.directive';
import { DsDynamicLookupRelationSearchTabComponent } from './dynamic-lookup-relation-search-tab.component';


describe('DsDynamicLookupRelationSearchTabComponent', () => {
  let component: DsDynamicLookupRelationSearchTabComponent;
  let fixture: ComponentFixture<DsDynamicLookupRelationSearchTabComponent>;
  let relationship;
  let pSearchOptions;
  let item1;
  let item2;
  let item3;
  let item4;
  let searchResult1;
  let searchResult2;
  let searchResult3;
  let searchResult4;
  let listID;
  let selection$;

  let results;
  let searchResult;
  let selectableListService;
  let lookupRelationService;
  const relationshipService = jasmine.createSpyObj('searchByItemsAndType',{
    searchByItemsAndType: observableOf(relatedRelationships),
  });

  const relationshipType = {
    'type': 'relationshiptype',
    'id': 1,
    'uuid': 'relationshiptype-1',
    'leftwardType': 'isAuthorOfPublication',
    'leftMaxCardinality': null,
    'leftMinCardinality': 0,
    'rightwardType': 'isPublicationOfAuthor',
    'rightMaxCardinality': null,
    'rightMinCardinality': 0,
  };

  function init() {
    relationship = Object.assign(new RelationshipOptions(), {
      filter: 'filter',
      relationshipType: 'isAuthorOfPublication',
      nameVariants: true,
      searchConfiguration: 'personConfig',
    });
    pSearchOptions = new PaginatedSearchOptions({});
    item1 = Object.assign(new Item(), { uuid: 'e1c51c69-896d-42dc-8221-1d5f2ad5516e' });
    item2 = Object.assign(new Item(), { uuid: 'c8279647-1acc-41ae-b036-951d5f65649b' });
    item3 = Object.assign(new Item(), { uuid: 'c3bcbff5-ec0c-4831-8e4c-94b9c933ccac' });
    item4 = Object.assign(new Item(), { uuid: 'f96a385e-de10-45b2-be66-7f10bf52f765' });
    searchResult1 = Object.assign(new ItemSearchResult(), { indexableObject: item1 });
    searchResult2 = Object.assign(new ItemSearchResult(), { indexableObject: item2 });
    searchResult3 = Object.assign(new ItemSearchResult(), { indexableObject: item3 });
    searchResult4 = Object.assign(new ItemSearchResult(), { indexableObject: item4 });
    listID = '6b0c8221-fcb4-47a8-b483-ca32363fffb3';
    selection$ = observableOf([searchResult1, searchResult2]);

    results = buildPaginatedList(undefined, [searchResult1, searchResult2, searchResult3]);
    searchResult = Object.assign(new SearchObjects(), {
      page: [searchResult1, searchResult2, searchResult3],
    });
    selectableListService = jasmine.createSpyObj('selectableListService', ['deselect', 'select', 'deselectAll']);
    lookupRelationService = jasmine.createSpyObj('lookupRelationService', {
      getLocalResults: createSuccessfulRemoteDataObject$(results),
    });
    lookupRelationService.searchConfig = {};
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), DsDynamicLookupRelationSearchTabComponent, VarDirective],
      providers: [
        { provide: SearchService, useValue: { search: () => createSuccessfulRemoteDataObject$(results) } },
        {
          provide: SelectableListService, useValue: selectableListService,
        },
        {
          provide: SearchConfigurationService, useValue: {
            paginatedSearchOptions: observableOf(pSearchOptions),
          },
        },
        { provide: LookupRelationService, useValue: lookupRelationService },
        { provide: PaginationService, useValue: new PaginationServiceStub() },
        { provide: RelationshipDataService, useValue: relationshipService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(DsDynamicLookupRelationSearchTabComponent, {
        remove: {
          imports: [ThemedSearchComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsDynamicLookupRelationSearchTabComponent);
    component = fixture.componentInstance;
    component.relationship = relationship;
    component.selection$ = selection$;
    component.listId = listID;
    component.isLeft = true;
    component.isEditRelationship = true;
    component.item = Object.assign(new Item(),{ uuid: 'e2c31c49-846d-45dc-8651-1d6f2ad8519e' });
    component.relationshipType = Object.assign(new RelationshipType(),relationshipType);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectPage', () => {
    beforeEach(() => {
      spyOn(component.selectObject, 'emit');
      component.selectPage([searchResult1, searchResult2, searchResult4]);
    });

    it('should emit the page filtered from already selected objects and call select on the service for all objects', () => {
      expect(component.selectObject.emit).toHaveBeenCalledWith(searchResult4);
      expect(selectableListService.select).toHaveBeenCalledWith(listID, [searchResult1, searchResult2, searchResult4]);
    });
  });

  describe('deselectPage', () => {
    beforeEach(() => {
      spyOn(component.deselectObject, 'emit');
      component.deselectPage([searchResult1, searchResult2, searchResult3]);
    });

    it('should emit the page filtered from not yet selected objects and call select on the service for all objects', () => {
      expect((component.deselectObject as any).emit).toHaveBeenCalledWith(searchResult1, searchResult2);
      expect(selectableListService.deselect).toHaveBeenCalledWith(listID, [searchResult1, searchResult2, searchResult3]);
    });
  });

  describe('deselectAll', () => {
    beforeEach(() => {
      spyOn(component.deselectObject, 'emit');
      component.deselectAll();
    });

    it('should emit the page filtered from not yet selected objects and call select on the service for all objects', () => {
      expect((component.deselectObject as any).emit).toHaveBeenCalledWith(searchResult1, searchResult2);
      expect(selectableListService.deselectAll).toHaveBeenCalledWith(listID);
    });
  });

  describe('check searchByItemsAndType', () => {
    it('should call relationshipService.searchByItemsAndType', () => {
      component.onResultFound(searchResult);
      expect(relationshipService.searchByItemsAndType).toHaveBeenCalled();
    });
  });
});
