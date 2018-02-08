import { CommunitySearchResultGridElementComponent } from './community-search-result-grid-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../../testing/router-stub';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { Community } from '../../../../core/shared/community.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';

let fixture: ComponentFixture<CommunitySearchResultGridElementComponent>;
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

const mockCommunity: Community = Object.assign(new Community(), {
  metadata: [
    {
      key: 'dc.description.abstract',
      language: 'en_US',
      value: 'Short description'
    } ]

});

const createdGridElementComponent: CommunitySearchResultGridElementComponent = new CommunitySearchResultGridElementComponent(mockCommunity, truncatableServiceStub as TruncatableService);

describe('CommunitySearchResultGridElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitySearchResultGridElementComponent, TruncatePipe ],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: 'objectElementProvider', useValue: (createdGridElementComponent) }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommunitySearchResultGridElementComponent);
  }));

  it('should show the item result cards in the grid element', () => {
    expect(fixture.debugElement.query(By.css('ds-community-search-result-grid-element'))).toBeDefined();
  });

  it('should only show the description if "short description" metadata is present',() => {
    const descriptionText = expect(fixture.debugElement.query(By.css('p.card-text')));

    if (mockCommunity.shortDescription.length > 0) {
      expect(descriptionText).toBeDefined();
    }else {
      expect(descriptionText).not.toBeDefined();
    }
  });
});
