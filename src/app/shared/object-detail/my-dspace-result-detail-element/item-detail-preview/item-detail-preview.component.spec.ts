import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';

import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TruncatePipe } from '../../../utils/truncate.pipe';
import { Item } from '../../../../core/shared/item.model';
import { ItemDetailPreviewComponent } from './item-detail-preview.component';
import { MockTranslateLoader } from '../../../mocks/mock-translate-loader';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

let component: ItemDetailPreviewComponent;
let fixture: ComponentFixture<ItemDetailPreviewComponent>;

const mockItemWithAuthorAndDate: Item = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
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
const mockItemWithoutAuthorAndDate: Item = Object.assign(new Item(), {
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
    ]
  }
});

describe('ItemDetailPreviewComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        }),
      ],
      declarations: [ItemDetailPreviewComponent, TruncatePipe],
      providers: [
        { provide: 'objectElementProvider', useValue: { mockItemWithAuthorAndDate } }

      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemDetailPreviewComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemDetailPreviewComponent);
    component = fixture.componentInstance;

  }));

  beforeEach(() => {
    component.object = { hitHighlights: {} };
    component.item = mockItemWithAuthorAndDate;
    fixture.detectChanges();
  });

  it('should init thumbnail on init', () => {
    expect(component.thumbnail$).toBeDefined();
  });
});
