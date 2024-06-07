import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { EditRelationshipListWrapperComponent } from './edit-relationship-list-wrapper.component';
import { EditItemRelationshipsService } from '../edit-item-relationships.service';
import { By } from '@angular/platform-browser';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { ItemType } from '../../../../core/shared/item-relationships/item-type.model';
import { Item } from '../../../../core/shared/item.model';
import { cold } from 'jasmine-marbles';

describe('EditRelationshipListWrapperComponent', () => {
  let editItemRelationshipsService: EditItemRelationshipsService;
  let comp: EditRelationshipListWrapperComponent;
  let fixture: ComponentFixture<EditRelationshipListWrapperComponent>;

  const leftType = Object.assign(new ItemType(), {id: 'leftType', label: 'leftTypeString'});
  const rightType = Object.assign(new ItemType(), {id: 'rightType', label: 'rightTypeString'});

  const relationshipType = Object.assign(new RelationshipType(), {
    id: '1',
    leftMaxCardinality: null,
    leftMinCardinality: 0,
    leftType: createSuccessfulRemoteDataObject$(leftType),
    leftwardType: 'isOrgUnitOfOrgUnit',
    rightMaxCardinality: null,
    rightMinCardinality: 0,
    rightType: createSuccessfulRemoteDataObject$(rightType),
    rightwardType: 'isOrgUnitOfOrgUnit',
    uuid: 'relationshiptype-1',
  });

  const item = Object.assign(new Item(), {uuid: 'item-uuid'});

  beforeEach(waitForAsync(() => {

    editItemRelationshipsService = jasmine.createSpyObj('editItemRelationshipsService', {
      isProvidedItemTypeLeftType: observableOf(true),
      shouldDisplayBothRelationshipSides: observableOf(false),
    });


    TestBed.configureTestingModule({
      // imports: [NoopAnimationsModule, SharedModule, TranslateModule.forRoot()],
      declarations: [EditRelationshipListWrapperComponent],
      providers: [
        {provide: EditItemRelationshipsService, useValue: editItemRelationshipsService},
        ChangeDetectorRef
      ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRelationshipListWrapperComponent);
    comp = fixture.componentInstance;
    comp.relationshipType = relationshipType;
    comp.itemType = leftType;
    comp.item = item;

    fixture.detectChanges();
  });

  describe('onInit', () => {
    it('should render the component', () => {
      expect(comp).toBeTruthy();
    });
    it('should set currentItemIsLeftItem$ and bothItemsMatchType$  based on the provided relationshipType, itemType and item', () => {
      expect(editItemRelationshipsService.isProvidedItemTypeLeftType).toHaveBeenCalledWith(relationshipType, leftType, item);
      expect(editItemRelationshipsService.shouldDisplayBothRelationshipSides).toHaveBeenCalledWith(relationshipType, leftType);

      expect(comp.currentItemIsLeftItem$.getValue()).toEqual(true);
      expect(comp.shouldDisplayBothRelationshipSides$).toBeObservable(cold('(a|)', { a: false }));
    });
  });

  describe('when the current item is left', () => {
    it('should render one relationship list section', () => {
      const relationshipLists = fixture.debugElement.queryAll(By.css('ds-edit-relationship-list'));
      expect(relationshipLists.length).toEqual(1);
    });
  });

  describe('when the current item is right', () => {
    it('should render one relationship list section', () => {
      (editItemRelationshipsService.isProvidedItemTypeLeftType as jasmine.Spy).and.returnValue(observableOf(false));
      comp.ngOnInit();
      fixture.detectChanges();

      const relationshipLists = fixture.debugElement.queryAll(By.css('ds-edit-relationship-list'));
      expect(relationshipLists.length).toEqual(1);
    });
  });

  describe('when the current item is both left and right', () => {
    it('should render two relationship list sections', () => {
      (editItemRelationshipsService.shouldDisplayBothRelationshipSides as jasmine.Spy).and.returnValue(observableOf(true));
      comp.ngOnInit();
      fixture.detectChanges();

      const relationshipLists = fixture.debugElement.queryAll(By.css('ds-edit-relationship-list'));
      expect(relationshipLists.length).toEqual(2);
    });
  });

});
