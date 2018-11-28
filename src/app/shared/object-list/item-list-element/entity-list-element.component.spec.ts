import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { EntityListElementComponent } from './entity-list-element.component';
import { Item } from '../../../core/shared/item.model';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PageInfo } from '../../../core/shared/page-info.model';
import { By } from '@angular/platform-browser';
import { createRelationshipsObservable } from '../../../+item-page/simple/entity-types/shared/entity.component.spec';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [],
  relationships: createRelationshipsObservable()
});

describe('EntityListElementComponent', () => {
  let comp: EntityListElementComponent;
  let fixture: ComponentFixture<EntityListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [EntityListElementComponent],
      providers: [
        { provide: 'objectElementProvider', useValue: mockItem }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(EntityListElementComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EntityListElementComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should call an entity-type-switcher component and pass the item', () => {
    const entityTypeSwitcher = fixture.debugElement.query(By.css('ds-entity-type-switcher')).componentInstance;
    expect(entityTypeSwitcher.object).toBe(mockItem);
  });

});
