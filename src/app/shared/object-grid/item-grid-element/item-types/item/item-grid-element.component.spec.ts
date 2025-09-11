import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DSONameService,
  buildPaginatedList,
  Item,
  PageInfo,
  DSONameServiceMock,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core'
import { of } from 'rxjs';

import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../../utils/truncate.pipe';
import {
  ItemSearchResultGridElementComponent,
} from '../../../search-result-grid-element/item-search-result/item/item-search-result-grid-element.component';
import { ItemGridElementComponent } from './item-grid-element.component';


const mockItem = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald',
      },
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26',
      },
    ],
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'This is an abstract',
      },
    ],
  },
});

describe('ItemGridElementComponent', () => {
  let comp;
  let fixture;

  const truncatableServiceStub: any = {
    isCollapsed: (id: number) => of(true),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TruncatePipe, ItemGridElementComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: TruncatableService, useValue: truncatableServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ItemGridElementComponent, {
      remove: {
        imports: [ItemSearchResultGridElementComponent],
      },
      add: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemGridElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the publication is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a PublicationGridElementComponent`, () => {
      const publicationGridElement = fixture.debugElement.query(By.css(`ds-item-search-result-grid-element`));
      expect(publicationGridElement).not.toBeNull();
    });
  });
});
