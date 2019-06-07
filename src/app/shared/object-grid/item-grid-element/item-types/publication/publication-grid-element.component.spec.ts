import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TruncatePipe } from '../../../../utils/truncate.pipe';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PublicationGridElementComponent } from './publication-grid-element.component';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { ItemSearchResult } from '../../../../object-collection/shared/item-search-result.model';
import { Item } from '../../../../../core/shared/item.model';
import { ITEM } from '../../../../items/switcher/item-type-switcher.component';

const mockItemWithMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithMetadata.hitHighlights = {};
mockItemWithMetadata.indexableObject = Object.assign(new Item(), {
  bitstreams: observableOf({}),
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
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26'
      }
    ],
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'This is an abstract'
      }
    ]
  }
});

const mockItemWithoutMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithoutMetadata.hitHighlights = {};
mockItemWithoutMetadata.indexableObject = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ]
  }
});

describe('PublicationGridElementComponent', getEntityGridElementTestComponent(PublicationGridElementComponent, mockItemWithMetadata, mockItemWithoutMetadata, ['authors', 'date', 'abstract']));

/**
 * Create test cases for a grid component of an entity.
 * @param component                     The component's class
 * @param searchResultWithMetadata      An ItemSearchResult containing an item with metadata that should be displayed in the grid element
 * @param searchResultWithoutMetadata   An ItemSearchResult containing an item that's missing the metadata that should be displayed in the grid element
 * @param fieldsToCheck                 A list of fields to check. The tests expect to find html elements with class ".item-${field}", so make sure they exist in the html template of the grid element.
 *                                      For example: If one of the fields to check is labeled "authors", the html template should contain at least one element with class ".item-authors" that's
 *                                      present when the author metadata is available.
 */
export function getEntityGridElementTestComponent(component, searchResultWithMetadata: ItemSearchResult, searchResultWithoutMetadata: ItemSearchResult, fieldsToCheck: string[]) {
  return () => {
    let comp;
    let fixture;

    const truncatableServiceStub: any = {
      isCollapsed: (id: number) => observableOf(true),
    };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule],
        declarations: [component, TruncatePipe],
        providers: [
          { provide: TruncatableService, useValue: truncatableServiceStub },
          {provide: ITEM, useValue: searchResultWithoutMetadata}
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).overrideComponent(component, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      }).compileComponents();
    }));

    beforeEach(async(() => {
      fixture = TestBed.createComponent(component);
      comp = fixture.componentInstance;
    }));

    fieldsToCheck.forEach((field) => {
      describe(`when the item has "${field}" metadata`, () => {
        beforeEach(() => {
          comp.dso = searchResultWithMetadata.indexableObject;
          fixture.detectChanges();
        });

        it(`should show the "${field}" field`, () => {
          const itemAuthorField = fixture.debugElement.query(By.css(`.item-${field}`));
          expect(itemAuthorField).not.toBeNull();
        });
      });

      describe(`when the item has no "${field}" metadata`, () => {
        beforeEach(() => {
          comp.dso = searchResultWithoutMetadata.indexableObject;
          fixture.detectChanges();
        });

        it(`should not show the "${field}" field`, () => {
          const itemAuthorField = fixture.debugElement.query(By.css(`.item-${field}`));
          expect(itemAuthorField).toBeNull();
        });
      });
    });
  }
}
