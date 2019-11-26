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

  function init() {
    item = Object.assign(new Item(), { uuid: '7680ca97-e2bd-4398-bfa7-139a8673dc42', metadata: {} });
    item1 = Object.assign(new Item(), { uuid: 'e1c51c69-896d-42dc-8221-1d5f2ad5516e' });
    item2 = Object.assign(new Item(), { uuid: 'c8279647-1acc-41ae-b036-951d5f65649b' });
    searchResult1 = Object.assign(new ItemSearchResult(), { indexableObject: item1 });
    searchResult2 = Object.assign(new ItemSearchResult(), { indexableObject: item2 });
    listID = '6b0c8221-fcb4-47a8-b483-ca32363fffb3';
    selection$ = observableOf([searchResult1, searchResult2]);
    selectableListService = { getSelectableList: () => selection$ };
    relationship = { filter: 'filter', relationshipType: 'isAuthorOfPublication', nameVariants: true } as RelationshipOptions;
    nameVariant = 'Doe, J.';
    metadataField = 'dc.contributor.author';
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [DsDynamicLookupRelationModalComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NgbModule.forRoot()],
      providers: [
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
      const action = new AddRelationshipAction(component.item, searchResult1.indexableObject, relationship.relationshipType, nameVariant);
      const action2 = new AddRelationshipAction(component.item, searchResult2.indexableObject, relationship.relationshipType, nameVariant);

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
      const action = new RemoveRelationshipAction(component.item, searchResult1.indexableObject, relationship.relationshipType);
      const action2 = new RemoveRelationshipAction(component.item, searchResult2.indexableObject, relationship.relationshipType);

      expect((component as any).store.dispatch).toHaveBeenCalledWith(action);
      expect((component as any).store.dispatch).toHaveBeenCalledWith(action2);
    })
  });
});
