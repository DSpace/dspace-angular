import { ItemListElementComponent } from './item-list-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../testing/router-stub';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TruncatePipe } from '../../utils/truncate.pipe';
import { Item } from '../../../core/shared/item.model';

let itemListElementComponent: ItemListElementComponent;
let fixture: ComponentFixture<ItemListElementComponent>;
const queryParam = 'test query';
const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
const activatedRouteStub = {
  queryParams: Observable.of({
    query: queryParam,
    scope: scopeParam
  })
};
/* tslint:disable:no-shadowed-variable */
const mockItem: Item = Object.assign(new Item(), {
  metadata: [
    {
      key: 'dc.contributor.author',
      language: 'en_US',
      value: 'Smith, Donald'
    }]
});

const createdListElementComponent:ItemListElementComponent= new ItemListElementComponent(mockItem);

describe('ItemListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemListElementComponent , TruncatePipe],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: 'objectElementProvider', useValue: {createdListElementComponent}}
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemListElementComponent);
    itemListElementComponent = fixture.componentInstance;

  }));

  it('should show the item cards in the list element',() => {
    expect(fixture.debugElement.query(By.css('ds-item-list-element'))).toBeDefined()
  });

  it('should only show the author span if the author metadata is present',() => {
    const itemAuthorField = expect(fixture.debugElement.query(By.css('p.item-authors')));

    if (mockItem.filterMetadata(['dc.contributor.author', 'dc.creator', 'dc.contributor.*']).length > 0) {
      expect(itemAuthorField).toBeDefined();
    }else {
      expect(itemAuthorField).toBeDefined();
    }
  });

})
