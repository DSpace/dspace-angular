import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { of as observableOf } from 'rxjs';

import { RouterStub } from '../../testing/router-stub';
import { WrapperDetailElementComponent } from './wrapper-detail-element.component';

let wrapperDetailElementComponent: WrapperDetailElementComponent;
let fixture: ComponentFixture<WrapperDetailElementComponent>;
const queryParam = 'test query';
const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
const activatedRouteStub = {
  queryParams: observableOf({
    query: queryParam,
    scope: scopeParam
  })
};

describe('WrapperDetailElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapperDetailElementComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: 'objectElementProvider', useFactory: (WrapperDetailElementComponent)}
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WrapperDetailElementComponent);
    wrapperDetailElementComponent = fixture.componentInstance;
  }));

  it('should show the wrapper element containing the detail object',() => {
    expect(fixture.debugElement.query(By.css('ds-workspaceitem-my-dspace-result-detail-element'))).toBeDefined();
  })
});
