import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { Context } from '../../../../core/shared/context.model';
import { Item } from '../../../../core/shared/item.model';
import { DSONameServiceMock } from '../../../mocks/dso-name.service.mock';
import { ItemActionsComponent } from '../../../mydspace-actions/item/item-actions.component';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { ItemDetailPreviewComponent } from '../item-detail-preview/item-detail-preview.component';
import { ItemSearchResultDetailElementComponent } from './item-search-result-detail-element.component';

let component: ItemSearchResultDetailElementComponent;
let fixture: ComponentFixture<ItemSearchResultDetailElementComponent>;

const compIndex = 1;

const mockResultObject: ItemSearchResult = new ItemSearchResult();
mockResultObject.hitHighlights = {};

mockResultObject.indexableObject = Object.assign(new Item(), {
  bundles: of({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article',
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
  },
});

describe('ItemSearchResultDetailElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ItemSearchResultDetailElementComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ItemSearchResultDetailElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: {
        imports: [ItemDetailPreviewComponent, ItemActionsComponent],
      },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemSearchResultDetailElementComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.dso = mockResultObject.indexableObject;
    fixture.detectChanges();
  });

  it('should have the correct badge context', () => {
    expect(component.badgeContext).toEqual(Context.MyDSpaceArchived);
  });
});
