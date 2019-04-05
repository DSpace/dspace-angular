import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of as observableOf } from 'rxjs';

import { Item } from '../../../../core/shared/item.model';
import { ItemMyDSpaceResultListElementComponent } from './item-my-dspace-result-list-element.component';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { ItemMyDSpaceResult } from '../../../object-collection/shared/item-my-dspace-result.model';

let component: ItemMyDSpaceResultListElementComponent;
let fixture: ComponentFixture<ItemMyDSpaceResultListElementComponent>;

const compIndex = 1;

const mockResultObject: ItemMyDSpaceResult = new ItemMyDSpaceResult();
mockResultObject.hitHighlights = {};

mockResultObject.indexableObject = Object.assign(new Item(), {
  bitstreams: observableOf({}),
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
      declarations: [ItemMyDSpaceResultListElementComponent],
      providers: [
        { provide: 'objectElementProvider', useValue: (mockResultObject) },
        { provide: 'indexElementProvider', useValue: (compIndex) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemMyDSpaceResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemMyDSpaceResultListElementComponent);
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
