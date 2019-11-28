import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of as observableOf } from 'rxjs';

import { Item } from '../../../../core/shared/item.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { ItemSearchResultListElementSubmissionComponent } from './item-search-result-list-element-submission.component';
import { TruncatableService } from '../../../truncatable/truncatable.service';

let component: ItemSearchResultListElementSubmissionComponent;
let fixture: ComponentFixture<ItemSearchResultListElementSubmissionComponent>;

const compIndex = 1;

const mockResultObject: ItemSearchResult = new ItemSearchResult();
mockResultObject.hitHighlights = {};

mockResultObject.indexableObject = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article'
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
    ]
  }
});

describe('ItemMyDSpaceResultListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [ItemSearchResultListElementSubmissionComponent],
      providers: [
        { provide: TruncatableService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemSearchResultListElementSubmissionComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemSearchResultListElementSubmissionComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.dso = mockResultObject.indexableObject;
    fixture.detectChanges();
  });

  it('should have properly status', () => {
    expect(component.status).toEqual(MyDspaceItemStatusType.ARCHIVED);
  });
});
