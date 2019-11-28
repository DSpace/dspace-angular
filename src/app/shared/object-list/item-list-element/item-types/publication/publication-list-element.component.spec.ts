import { async, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PublicationListElementComponent } from './publication-list-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../utils/truncate.pipe';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { of as observableOf } from 'rxjs';

const mockItem: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'dc.publisher': [
      {
        language: 'en_US',
        value: 'a publisher'
      }
    ],
    'dc.date.issued': [
      {
        language: 'en_US',
        value: '2015-06-26'
      }
    ],
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'This is the abstract'
      }
    ]
  }
});

describe('PublicationListElementComponent', () => {
  let comp;
  let fixture;

  const truncatableServiceStub: any = {
    isCollapsed: (id: number) => observableOf(true),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublicationListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(PublicationListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PublicationListElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the publication is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a PublicationListElementComponent`, () => {
      const publicationListElement = fixture.debugElement.query(By.css(`ds-publication-search-result-list-element`));
      expect(publicationListElement).not.toBeNull();
    });
  });
});
