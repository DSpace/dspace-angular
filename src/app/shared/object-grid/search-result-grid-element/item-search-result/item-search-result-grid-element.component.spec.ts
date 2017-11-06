import { ItemSearchResultGridElementComponent } from './item-search-result-grid-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../../testing/router-stub';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { Item } from '../../../../core/shared/item.model';


let itemSearchResultGridElementComponent: ItemSearchResultGridElementComponent;
let fixture: ComponentFixture<ItemSearchResultGridElementComponent>;
const queryParam = 'test query';
const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
const activatedRouteStub = {
  queryParams: Observable.of({
    query: queryParam,
    scope: scopeParam
  })
};
let mockItem: Item = Object.assign(new Item(), {
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
let createdGridElementComponent:ItemSearchResultGridElementComponent= new ItemSearchResultGridElementComponent(mockItem);

describe('ItemSearchResultGridElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSearchResultGridElementComponent, TruncatePipe ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: 'objectElementProvider', useValue: (createdGridElementComponent) }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemSearchResultGridElementComponent);
    itemSearchResultGridElementComponent = fixture.componentInstance;

  }));

  it('should show the item result cards in the grid element',()=>{
    expect(fixture.debugElement.query(By.css('ds-item-search-result-grid-element'))).toBeDefined();
  });

  it('should only show the author span if the author metadata is present',()=>{
    let itemAuthorField = expect(fixture.debugElement.query(By.css('p.item-authors')));

    if(mockItem.filterMetadata(['dc.contributor.author', 'dc.creator', 'dc.contributor.*']).length>0){
      expect(itemAuthorField).toBeDefined();
    }else{
      expect(itemAuthorField).not.toBeDefined();
    }
  });

  it('should only show the date span if the issuedate is present',()=>{
    let dateField = expect(fixture.debugElement.query(By.css('span.item-list-date')));

    if(mockItem.findMetadata('dc.date.issued').length>0){
      expect(dateField).toBeDefined();
    }else{
      expect(dateField).not.toBeDefined();
    }
  });




});
