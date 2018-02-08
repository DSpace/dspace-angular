import { CommunityGridElementComponent } from './community-grid-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../testing/router-stub';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';
import { Community } from '../../../core/shared/community.model';

let communityGridElementComponent: CommunityGridElementComponent;
let fixture: ComponentFixture<CommunityGridElementComponent>;
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

const createdGridElementComponent:CommunityGridElementComponent= new CommunityGridElementComponent(mockCommunity);

describe('CommunityGridElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityGridElementComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: 'objectElementProvider', useValue: (createdGridElementComponent)}
      ],

    schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommunityGridElementComponent);
    communityGridElementComponent = fixture.componentInstance;

  }));

  it('should show the community cards in the grid element',() => {
    console.log(fixture.debugElement.query(By.css('ds-community-grid-element')));
    expect(fixture.debugElement.query(By.css('ds-community-grid-element'))).toBeDefined();
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
