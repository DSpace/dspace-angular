import {CollectionSearchResultGridElementComponent } from './collection-search-result-grid-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../../testing/router-stub';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { Community } from '../../../../core/shared/community.model';
import { Collection } from '../../../../core/shared/collection.model';


let fixture: ComponentFixture<CollectionSearchResultGridElementComponent>;
const queryParam = 'test query';
const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
const activatedRouteStub = {
  queryParams: Observable.of({
    query: queryParam,
    scope: scopeParam
  })
};
let mockCollection: Collection = Object.assign(new Collection(), {
  metadata: [
    {
      key: 'dc.description.abstract',
      language: 'en_US',
      value: 'Short description'
    } ]

});

let createdGridElementComponent: CollectionSearchResultGridElementComponent = new CollectionSearchResultGridElementComponent(mockCollection);


describe('CollectionSearchResultGridElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionSearchResultGridElementComponent, TruncatePipe ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: 'objectElementProvider', useValue: (createdGridElementComponent) }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CollectionSearchResultGridElementComponent);
  }));

  it('should show the item result cards in the grid element', () => {
    expect(fixture.debugElement.query(By.css('ds-collection-search-result-grid-element'))).toBeDefined();
  });


  it('should only show the description if "short description" metadata is present',()=>{
    let descriptionText = expect(fixture.debugElement.query(By.css('p.card-text')));

    if(mockCollection.shortDescription.length>0){
      expect(descriptionText).toBeDefined();
    }else{
      expect(descriptionText).not.toBeDefined();
    }
  });
});
