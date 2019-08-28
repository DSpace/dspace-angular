import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TruncatePipe } from '../../../utils/truncate.pipe';
import { Item } from '../../../../core/shared/item.model';
import { ItemDetailPreviewComponent } from './item-detail-preview.component';
import { MockTranslateLoader } from '../../../mocks/mock-translate-loader';
import { ItemDetailPreviewFieldComponent } from './item-detail-preview-field/item-detail-preview-field.component';
import { FileSizePipe } from '../../../utils/file-size-pipe';
import { VarDirective } from '../../../utils/var.directive';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';

let component: ItemDetailPreviewComponent;
let fixture: ComponentFixture<ItemDetailPreviewComponent>;

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: observableOf(new RemoteData(false, false, true, undefined, new PaginatedList(new PageInfo(), []))),
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
    ],
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
      declarations: [ItemDetailPreviewComponent, ItemDetailPreviewFieldComponent, TruncatePipe, FileSizePipe, VarDirective],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemDetailPreviewComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemDetailPreviewComponent);
    component = fixture.componentInstance;
    component.object = { hitHighlights: {} } as any;
    component.item = mockItem;
    component.separator = ', ';
    spyOn(component.item, 'getFiles').and.returnValue(mockItem.bitstreams);
    fixture.detectChanges();

  }));

  it('should init thumbnail and bitstreams on init', () => {
    expect(component.thumbnail$).toBeDefined();
    expect(component.bitstreams$).toBeDefined();
  });
});
