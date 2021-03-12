import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DsDynamicLookupRelationSearchTabComponent } from './dynamic-lookup-relation-search-tab.component';
import { SearchService } from '../../../../../../core/shared/search/search.service';
import { SelectableListService } from '../../../../../object-list/selectable-list/selectable-list.service';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { RouteService } from '../../../../../../core/services/route.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VarDirective } from '../../../../../utils/var.directive';
import { RelationshipOptions } from '../../../models/relationship-options.model';
import { of as observableOf } from 'rxjs';
import { PaginatedSearchOptions } from '../../../../../search/paginated-search-options.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../remote-data.utils';
import { buildPaginatedList } from '../../../../../../core/data/paginated-list.model';
import { ItemSearchResult } from '../../../../../object-collection/shared/item-search-result.model';
import { Item } from '../../../../../../core/shared/item.model';
import { ActivatedRoute } from '@angular/router';
import { LookupRelationService } from '../../../../../../core/data/lookup-relation.service';

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
  let selectableListService;
  let lookupRelationService;

  function init() {
    relationship = Object.assign(new RelationshipOptions(), {
      filter: 'filter',
      relationshipType: 'isAuthorOfPublication',
      nameVariants: true,
      searchConfiguration: 'personConfig'
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
    selectableListService = jasmine.createSpyObj('selectableListService', ['deselect', 'select', 'deselectAll']);
    lookupRelationService = jasmine.createSpyObj('lookupRelationService', {
      getLocalResults: createSuccessfulRemoteDataObject$(results)
    });
    lookupRelationService.searchConfig = {};
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [DsDynamicLookupRelationSearchTabComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: SearchService, useValue: { search: () => createSuccessfulRemoteDataObject$(results) } },
        {
          provide: SelectableListService, useValue: selectableListService
        },
        {
          provide: SearchConfigurationService, useValue: {
            paginatedSearchOptions: observableOf(pSearchOptions)
          }
        },
        {
          provide: RouteService, useValue: {
            setParameter: () => {
              // do nothing
            }
          }
        },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
        { provide: LookupRelationService, useValue: lookupRelationService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsDynamicLookupRelationSearchTabComponent);
    component = fixture.componentInstance;
    component.relationship = relationship;
    component.selection$ = selection$;
    component.listId = listID;
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

  describe('selectAll', () => {
    beforeEach(() => {
      spyOn(component.selectObject, 'emit');
      component.selectAll();
    });

    it('should emit the page filtered from already selected objects and call select on the service for all objects', () => {
      expect(component.selectObject.emit).toHaveBeenCalledWith(searchResult3);
      expect(selectableListService.select).toHaveBeenCalledWith(listID, [searchResult1, searchResult2, searchResult3]);
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
});
