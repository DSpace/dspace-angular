import { ItemSearchResultGridElementComponent } from './item-search-result-grid-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../../testing/router-stub';
import { NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { Item } from '../../../../core/shared/item.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';

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

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => Observable.of(true),
};

const mockItemWithAuthorAndDate: ItemSearchResult = new ItemSearchResult();
mockItemWithAuthorAndDate.hitHighlights = [];
mockItemWithAuthorAndDate.dspaceObject = Object.assign(new Item(), {
  bitstreams: Observable.of({}),
  metadata: [
    {
      key: 'dc.contributor.author',
      language: 'en_US',
      value: 'Smith, Donald'
    },
    {
      key: 'dc.date.issued',
      language: null,
      value: '2015-06-26'
    }]
});

const mockItemWithoutAuthorAndDate: ItemSearchResult = new ItemSearchResult();
mockItemWithoutAuthorAndDate.hitHighlights = [];
mockItemWithoutAuthorAndDate.dspaceObject = Object.assign(new Item(), {
  bitstream: Observable.of({}),
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'This is just another title'
    },
    {
      key: 'dc.type',
      language: null,
      value: 'Article'
    }]
});

const createdGridElementComponent: ItemSearchResultGridElementComponent = new ItemSearchResultGridElementComponent(mockItemWithAuthorAndDate, truncatableServiceStub as TruncatableService);

describe('ItemSearchResultGridElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [ItemSearchResultGridElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: 'objectElementProvider', useValue: (createdGridElementComponent) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemSearchResultGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemSearchResultGridElementComponent);
    itemSearchResultGridElementComponent = fixture.componentInstance;
  }));

  fdescribe('When the item has an author', () => {
    beforeEach(() => {
      itemSearchResultGridElementComponent.dso = mockItemWithAuthorAndDate.dspaceObject;
      fixture.detectChanges();
    });

    it('should show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('p.item-authors'));
      expect(itemAuthorField).not.toBeNull();
    });
  });

  describe('When the item has no author', () => {
    beforeEach(() => {
      itemSearchResultGridElementComponent.dso = mockItemWithoutAuthorAndDate.dspaceObject;
    });

    it('should not show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('p.item-authors'));
      expect(itemAuthorField).toBeNull();
    });
  });

  describe('When the item has an issuedate', () => {
    beforeEach(() => {
      itemSearchResultGridElementComponent.dso = mockItemWithAuthorAndDate.dspaceObject;
    });

    it('should show the issuedate span', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-date'));
      expect(itemAuthorField).not.toBeNull();
    });
  });

  describe('When the item has no issuedate', () => {
    beforeEach(() => {
      itemSearchResultGridElementComponent.dso = mockItemWithoutAuthorAndDate.dspaceObject;
    });

    it('should not show the issuedate span', () => {
      const dateField = fixture.debugElement.query(By.css('span.item-date'));
      expect(dateField).toBeNull();
    });
  });
});
