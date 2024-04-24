import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of as observableOf } from 'rxjs';

import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { buildPaginatedList } from '../../../../../core/data/paginated-list.model';
import { Item } from '../../../../../core/shared/item.model';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { DSONameServiceMock } from '../../../../mocks/dso-name.service.mock';
import { createSuccessfulRemoteDataObject$ } from '../../../../remote-data.utils';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../../utils/truncate.pipe';
import { ItemSearchResultGridElementComponent } from '../../../search-result-grid-element/item-search-result/item/item-search-result-grid-element.component';
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
    isCollapsed: (id: number) => observableOf(true),
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
