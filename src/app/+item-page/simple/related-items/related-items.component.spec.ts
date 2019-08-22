import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { RelatedItemsComponent } from './related-items-component';
import { Item } from '../../../core/shared/item.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PageInfo } from '../../../core/shared/page-info.model';
import { By } from '@angular/platform-browser';
import { createRelationshipsObservable } from '../item-types/shared/item.component.spec';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/testing/utils';

const mockItem1: Item = Object.assign(new Item(), {
  bitstreams: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: [],
  relationships: createRelationshipsObservable()
});
const mockItem2: Item = Object.assign(new Item(), {
  bitstreams: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: [],
  relationships: createRelationshipsObservable()
});
const mockItems = [mockItem1, mockItem2];

describe('RelatedItemsComponent', () => {
  let comp: RelatedItemsComponent;
  let fixture: ComponentFixture<RelatedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [RelatedItemsComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(RelatedItemsComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RelatedItemsComponent);
    comp = fixture.componentInstance;
    comp.items = mockItems;
    fixture.detectChanges();
  }));

  it(`should load ${mockItems.length} item-type-switcher components`, () => {
    const fields = fixture.debugElement.queryAll(By.css('ds-item-type-switcher'));
    expect(fields.length).toBe(mockItems.length);
  });

});
