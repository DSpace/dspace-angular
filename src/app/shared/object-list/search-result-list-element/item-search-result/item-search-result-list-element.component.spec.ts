import { ItemSearchResultListElementComponent } from './item-search-result-list-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../../testing/router-stub';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { Item } from '../../../../core/shared/item.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';

let itemSearchResultListElementComponent: ItemSearchResultListElementComponent;
let fixture: ComponentFixture<ItemSearchResultListElementComponent>;
const queryParam = 'test query';
const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
const activatedRouteStub = {
  queryParams: Observable.of({
    query: queryParam,
    scope: scopeParam
  })
};

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => Observable.of(true),
};

const mockItem: Item = Object.assign(new Item(), {
  metadata: [
    {
      key: 'dc.contributor.author',
      language: 'en_US',
      value: 'Smith, Donald'
    },
    {
      key: 'dc.date.issued',
      language: null,
      value: '1650-06-26'
    }]
});
const createdListElementComponent: ItemSearchResultListElementComponent = new ItemSearchResultListElementComponent(mockItem, truncatableServiceStub as TruncatableService);

describe('ItemSearchResultListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemSearchResultListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: 'objectElementProvider', useValue: (createdListElementComponent) }
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemSearchResultListElementComponent);
    itemSearchResultListElementComponent = fixture.componentInstance;
  }));

  it('should show the item result cards in the list element', () => {
    expect(fixture.debugElement.query(By.css('ds-item-search-result-list-element'))).toBeDefined();
  });

  it('should only show the author span if the author metadata is present', () => {
    const itemAuthorField = expect(fixture.debugElement.query(By.css('p.item-authors')));

    if (mockItem.filterMetadata(['dc.contributor.author', 'dc.creator', 'dc.contributor.*']).length > 0) {
      expect(itemAuthorField).toBeDefined();
    } else {
      expect(itemAuthorField).not.toBeDefined();
    }
  });

  it('should only show the date span if the issuedate is present', () => {
    const dateField = expect(fixture.debugElement.query(By.css('span.item-list-date')));

    if (mockItem.findMetadata('dc.date.issued').length > 0) {
      expect(dateField).toBeDefined();
    } else {
      expect(dateField).not.toBeDefined();
    }
  });

});
