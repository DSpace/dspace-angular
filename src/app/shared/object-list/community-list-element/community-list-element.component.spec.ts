import { CommunityListElementComponent } from './community-list-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../testing/router-stub';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';
import { Community } from '../../../core/shared/community.model';

let communityListElementComponent: CommunityListElementComponent;
let fixture: ComponentFixture<CommunityListElementComponent>;
const queryParam = 'test query';
const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
const activatedRouteStub = {
  queryParams: Observable.of({
    query: queryParam,
    scope: scopeParam
  })
};

const mockCommunity: Community = Object.assign(new Community(), {
  metadata: [
    {
      key: 'dc.description.abstract',
      language: 'en_US',
      value: 'Short description'
    }]
});

const createdListElementComponent:CommunityListElementComponent= new CommunityListElementComponent(mockCommunity);

describe('CommunityListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityListElementComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: 'objectElementProvider', useValue: (createdListElementComponent)}
      ],

    schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommunityListElementComponent);
    communityListElementComponent = fixture.componentInstance;

  }));

  it('should show the community cards in the list element',() => {
    expect(fixture.debugElement.query(By.css('ds-community-list-element'))).toBeDefined();
  })

  it('should only show the description if "short description" metadata is present',() => {
    const descriptionText = expect(fixture.debugElement.query(By.css('p.card-text')));

    if (mockCommunity.shortDescription.length > 0) {
      expect(descriptionText).toBeDefined();
    }else {
      expect(descriptionText).not.toBeDefined();
    }
  });
});
