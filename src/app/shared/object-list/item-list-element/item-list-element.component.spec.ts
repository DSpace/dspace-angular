import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemListElementComponent } from './item-list-element.component';
import { Item } from '../../../core/shared/item.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PageInfo } from '../../../core/shared/page-info.model';
import { By } from '@angular/platform-browser';
import { createRelationshipsObservable } from '../../../+item-page/simple/item-types/shared/item.component.spec';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../../testing/utils';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: [],
  relationships: createRelationshipsObservable()
});

describe('ItemListElementComponent', () => {
  let comp: ItemListElementComponent;
  let fixture: ComponentFixture<ItemListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ItemListElementComponent],
      providers: [
        { provide: 'objectElementProvider', useValue: mockItem }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemListElementComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemListElementComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should call an item-type-switcher component and pass the item', () => {
    const itemTypeSwitcher = fixture.debugElement.query(By.css('ds-item-type-switcher')).componentInstance;
    expect(itemTypeSwitcher.object).toBe(mockItem);
  });

});
