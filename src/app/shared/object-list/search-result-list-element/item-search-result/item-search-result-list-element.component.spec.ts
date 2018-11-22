import { Item } from '../../../../core/shared/item.model';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { createRelationshipsObservable } from '../../../../+item-page/simple/entity-types/shared/entity-page-fields.component.spec';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ItemSearchResultListElementComponent } from './item-search-result-list-element.component';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../utils/truncate.pipe';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [],
  relationships: createRelationshipsObservable()
});

describe('ItemSearchResultListElementComponent', () => {
  let comp: ItemSearchResultListElementComponent;
  let fixture: ComponentFixture<ItemSearchResultListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ItemSearchResultListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: 'objectElementProvider', useValue: mockItem }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemSearchResultListElementComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemSearchResultListElementComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should call an entity-type-switcher component and pass the item', () => {
    const entityTypeSwitcher = fixture.debugElement.query(By.css('ds-entity-type-switcher')).componentInstance;
    expect(entityTypeSwitcher.object).toBe(mockItem);
  });

});
