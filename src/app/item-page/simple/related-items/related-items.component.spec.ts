import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { RelatedItemsComponent } from './related-items-component';
import { Item } from '../../../core/shared/item.model';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PageInfo } from '../../../core/shared/page-info.model';
import { By } from '@angular/platform-browser';
import { createRelationshipsObservable } from '../item-types/shared/item.component.spec';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/testing/utils';
import { RelationshipService } from '../../../core/data/relationship.service';
import { TranslateModule } from '@ngx-translate/core';

const parentItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: [],
  relationships: createRelationshipsObservable()
});
const mockItem1: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: [],
  relationships: createRelationshipsObservable()
});
const mockItem2: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: [],
  relationships: createRelationshipsObservable()
});
const mockItems = [mockItem1, mockItem2];
const relationType = 'isItemOfItem';
let relationshipService: RelationshipService;

describe('RelatedItemsComponent', () => {
  let comp: RelatedItemsComponent;
  let fixture: ComponentFixture<RelatedItemsComponent>;

  beforeEach(async(() => {
    relationshipService = jasmine.createSpyObj('relationshipService',
      {
        getRelatedItemsByLabel: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), mockItems)),
      }
    );

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [RelatedItemsComponent],
      providers: [
        { provide: RelationshipService, useValue: relationshipService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(RelatedItemsComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RelatedItemsComponent);
    comp = fixture.componentInstance;
    comp.parentItem = parentItem;
    comp.relationType = relationType;
    fixture.detectChanges();
  }));

  it(`should load ${mockItems.length} item-type-switcher components`, () => {
    const fields = fixture.debugElement.queryAll(By.css('ds-listable-object-component-loader'));
    expect(fields.length).toBe(mockItems.length);
  });

  describe('when viewMore is called', () => {
    beforeEach(() => {
      comp.viewMore();
    });

    it('should call relationship-service\'s getRelatedItemsByLabel with the correct arguments', () => {
      expect(relationshipService.getRelatedItemsByLabel).toHaveBeenCalledWith(parentItem, relationType, comp.allOptions);
    });

    it('should set showingAll to true', () => {
      expect(comp.showingAll).toEqual(true);
    });
  });

  describe('when viewLess is called', () => {
    beforeEach(() => {
      comp.viewLess();
    });

    it('should call relationship-service\'s getRelatedItemsByLabel with the correct arguments', () => {
      expect(relationshipService.getRelatedItemsByLabel).toHaveBeenCalledWith(parentItem, relationType, comp.options);
    });

    it('should set showingAll to false', () => {
      expect(comp.showingAll).toEqual(false);
    });
  });

});
