import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NgZone, NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf, Subscription } from 'rxjs';
import { DsDynamicLookupRelationModalComponent } from './dynamic-lookup-relation-modal.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';
import { RelationshipService } from '../../../../../core/data/relationship.service';
import { RelationshipTypeService } from '../../../../../core/data/relationship-type.service';
import { Store } from '@ngrx/store';
import { Item } from '../../../../../core/shared/item.model';
import { ItemSearchResult } from '../../../../object-collection/shared/item-search-result.model';
import { RelationshipOptions } from '../../models/relationship-options.model';
import { AddRelationshipAction, RemoveRelationshipAction } from './relationship.actions';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { PaginatedSearchOptions } from '../../../../search/paginated-search-options.model';
import { ExternalSource } from '../../../../../core/shared/external-source.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../remote-data.utils';
import { createPaginatedList } from '../../../../testing/utils.test';
import { ExternalSourceService } from '../../../../../core/data/external-source.service';
import { LookupRelationService } from '../../../../../core/data/lookup-relation.service';

describe('DsDynamicLookupRelationModalComponent', () => {
  let component: DsDynamicLookupRelationModalComponent;
  let fixture: ComponentFixture<DsDynamicLookupRelationModalComponent>;
  let item;
  let item1;
  let item2;
  let searchResult1;
  let searchResult2;
  let listID;
  let selection$;
  let selectableListService;
  let relationship;
  let nameVariant;
  let metadataField;
  let pSearchOptions;
  let externalSourceService;
  let lookupRelationService;
  let submissionId;

  const externalSources = [
    Object.assign(new ExternalSource(), {
      id: 'orcidV2',
      name: 'orcidV2',
      hierarchical: false
    }),
    Object.assign(new ExternalSource(), {
      id: 'sherpaPublisher',
      name: 'sherpaPublisher',
      hierarchical: false
    })
  ];
  const totalLocal = 10;
  const totalExternal = 8;

  function init() {
    item = Object.assign(new Item(), { uuid: '7680ca97-e2bd-4398-bfa7-139a8673dc42', metadata: {} });
    item1 = Object.assign(new Item(), { uuid: 'e1c51c69-896d-42dc-8221-1d5f2ad5516e' });
    item2 = Object.assign(new Item(), { uuid: 'c8279647-1acc-41ae-b036-951d5f65649b' });
    searchResult1 = Object.assign(new ItemSearchResult(), { indexableObject: item1 });
    searchResult2 = Object.assign(new ItemSearchResult(), { indexableObject: item2 });
    listID = '6b0c8221-fcb4-47a8-b483-ca32363fffb3';
    selection$ = observableOf([searchResult1, searchResult2]);
    selectableListService = { getSelectableList: () => selection$ };
    relationship = Object.assign(new RelationshipOptions(), { filter: 'filter', relationshipType: 'isAuthorOfPublication', nameVariants: true, searchConfiguration: 'personConfig' });
    nameVariant = 'Doe, J.';
    metadataField = 'dc.contributor.author';
    pSearchOptions = new PaginatedSearchOptions({});
    externalSourceService = jasmine.createSpyObj('externalSourceService', {
      findAll: createSuccessfulRemoteDataObject$(createPaginatedList(externalSources))
    });
    lookupRelationService = jasmine.createSpyObj('lookupRelationService', {
      getTotalLocalResults: observableOf(totalLocal),
      getTotalExternalResults: observableOf(totalExternal)
    });
    submissionId = '1234';
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [DsDynamicLookupRelationModalComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NgbModule],
      providers: [
        {
          provide: SearchConfigurationService, useValue: {
            paginatedSearchOptions: observableOf(pSearchOptions)
          }
        },
        { provide: ExternalSourceService, useValue: externalSourceService },
        { provide: LookupRelationService, useValue: lookupRelationService },
        {
          provide: SelectableListService, useValue: selectableListService
        },
        {
          provide: RelationshipService, useValue: { getNameVariant: () => observableOf(nameVariant) }
        },
        { provide: RelationshipTypeService, useValue: {} },
        {
          provide: Store, useValue: {
            // tslint:disable-next-line:no-empty
            dispatch: () => {}
          }
        },
        { provide: NgZone, useValue: new NgZone({}) },
        NgbActiveModal
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsDynamicLookupRelationModalComponent);
    component = fixture.componentInstance;
    component.listId = listID;
    component.relationshipOptions = relationship;
    component.item = item;
    component.metadataFields = metadataField;
    component.submissionId = submissionId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    beforeEach(() => {
      spyOn(component.modal, 'close');
    });

    it('should call close on the modal', () => {
      component.close();
      expect(component.modal.close).toHaveBeenCalled();
    })
  });

  describe('select', () => {
    beforeEach(() => {
      spyOn((component as any).store, 'dispatch');
    });

    it('should dispatch an AddRelationshipAction for each selected object', () => {
      component.select(searchResult1, searchResult2);
      const action = new AddRelationshipAction(component.item, searchResult1.indexableObject, relationship.relationshipType, submissionId, nameVariant);
      const action2 = new AddRelationshipAction(component.item, searchResult2.indexableObject, relationship.relationshipType, submissionId, nameVariant);

      expect((component as any).store.dispatch).toHaveBeenCalledWith(action);
      expect((component as any).store.dispatch).toHaveBeenCalledWith(action2);
    })
  });

  describe('deselect', () => {
    beforeEach(() => {
      component.subMap[searchResult1.indexableObject.uuid] = new Subscription();
      component.subMap[searchResult2.indexableObject.uuid] = new Subscription();
      spyOn((component as any).store, 'dispatch');
    });

    it('should dispatch an RemoveRelationshipAction for each deselected object', () => {
      component.deselect(searchResult1, searchResult2);
      const action = new RemoveRelationshipAction(component.item, searchResult1.indexableObject, relationship.relationshipType, submissionId);
      const action2 = new RemoveRelationshipAction(component.item, searchResult2.indexableObject, relationship.relationshipType, submissionId);

      expect((component as any).store.dispatch).toHaveBeenCalledWith(action);
      expect((component as any).store.dispatch).toHaveBeenCalledWith(action2);
    })
  });
});
