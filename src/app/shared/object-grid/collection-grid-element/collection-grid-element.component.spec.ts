import { CollectionGridElementComponent } from './collection-grid-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../testing/router-stub';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

let collectionGridElementComponent: CollectionGridElementComponent;
let fixture: ComponentFixture<CollectionGridElementComponent>;
const queryParam = 'test query';
const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
const activatedRouteStub = {
  queryParams: Observable.of({
    query: queryParam,
    scope: scopeParam
  })
};

describe('CollectionGridElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionGridElementComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: 'objectElementProvider', useFactory: (collectionGridElementComponent)}
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CollectionGridElementComponent);
    collectionGridElementComponent = fixture.componentInstance;

  }));

  it('should show the collection cards in the grid element',()=>{
    expect(fixture.debugElement.query(By.css('ds-collection-grid-element'))).toBeDefined();
  })
})
