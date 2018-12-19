import { WrapperGridElementComponent } from './wrapper-grid-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../testing/router-stub';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

let wrapperGridElementComponent: WrapperGridElementComponent;
let fixture: ComponentFixture<WrapperGridElementComponent>;
const queryParam = 'test query';
const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
const activatedRouteStub = {
  queryParams: observableOf({
    query: queryParam,
    scope: scopeParam
  })
};

describe('WrapperGridElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapperGridElementComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: 'objectElementProvider', useFactory: (wrapperGridElementComponent)}
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WrapperGridElementComponent);
    wrapperGridElementComponent = fixture.componentInstance;

  }));

  it('should show the wrapper element containing the cards',() => {
    expect(fixture.debugElement.query(By.css('ds-collection-grid-element'))).toBeDefined();
  })
})
