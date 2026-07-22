import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Item } from '@dspace/core/shared/item.model';
import { boxMetadata } from '@dspace/core/testing/box.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { DynamicLayoutLoaderDirective } from '../../../../directives/dynamic-layout-loader.directive';
import { DynamicLayoutMetadataBoxComponent } from './dynamic-layout-metadata-box.component';
import { TextComponent } from './rendering-types/text/text.component';
import { RowComponent } from './row/row.component';

describe('DynamicLayoutMetadataBoxComponent', () => {
  let component: DynamicLayoutMetadataBoxComponent;
  let fixture: ComponentFixture<DynamicLayoutMetadataBoxComponent>;

  const testItem = Object.assign(new Item(),
    {
      type: 'item',
      metadata: {
        'dc.title': [{
          'value': 'test item title',
          'language': null,
          'authority': null,
          'confidence': -1,
          'place': 0,
        }],
      },
      uuid: 'test-item-uuid',
    },
  );

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }),
      BrowserAnimationsModule, DynamicLayoutMetadataBoxComponent,
      DynamicLayoutLoaderDirective,
      RowComponent,
      TextComponent],
      providers: [
        { provide: 'boxProvider', useValue: boxMetadata },
        { provide: 'itemProvider', useValue: testItem },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(DynamicLayoutMetadataBoxComponent, { remove: { imports: [RowComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLayoutMetadataBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('check rows rendering', (done) => {
    const rowsFound = fixture.debugElement.queryAll(By.css('div[ds-row]'));

    expect(rowsFound.length).toEqual(2);
    done();
  });
});
