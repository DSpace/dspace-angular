import { CollectionListElementComponent } from './collection-list-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../testing/router-stub';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Collection } from '../../../core/shared/collection.model';
let fixture: ComponentFixture<CollectionListElementComponent>;
const queryParam = 'test query';
const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
const activatedRouteStub = {
  queryParams: Observable.of({
    query: queryParam,
    scope: scopeParam
  })
};
const mockCollection: Collection = Object.assign(new Collection(), {
  metadata: [
    {
      key: 'dc.description.abstract',
      language: 'en_US',
      value: 'Short description'
    }]
});
const createdListElementComponent:CollectionListElementComponent= new CollectionListElementComponent(mockCollection);

describe('CollectionListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionListElementComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: 'objectElementProvider', useValue: (createdListElementComponent)}
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CollectionListElementComponent);
  }));

  it('should show the collection cards in the list element',() => {
    expect(fixture.debugElement.query(By.css('ds-collection-list-element'))).toBeDefined();
  });

  it('should only show the description if "short description" metadata is present',() => {
    const descriptionText = expect(fixture.debugElement.query(By.css('p.card-text')));

    if (mockCollection.shortDescription.length > 0) {
      expect(descriptionText).toBeDefined();
    }else {
      expect(descriptionText).not.toBeDefined();
    }
  });
})
