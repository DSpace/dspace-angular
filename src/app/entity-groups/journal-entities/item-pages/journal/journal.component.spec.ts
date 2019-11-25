import { ChangeDetectionStrategy, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockTranslateLoader } from '../../../../shared/mocks/mock-translate-loader';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { isNotEmpty } from '../../../../shared/empty.util';
import { JournalComponent } from './journal.component';
import { GenericItemPageFieldComponent } from '../../../../+item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/testing/utils';
import { RelationshipService } from '../../../../core/data/relationship.service';

let comp: JournalComponent;
let fixture: ComponentFixture<JournalComponent>;

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: {
    'creativeworkseries.issn': [
      {
        language: 'en_US',
        value: '1234'
      }
    ],
    'creativework.publisher': [
      {
        language: 'en_US',
        value: 'a publisher'
      }
    ],
    'dc.description': [
      {
        language: 'en_US',
        value: 'desc'
      }
    ]
  }
});

describe('JournalComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: MockTranslateLoader
        }
      })],
      declarations: [JournalComponent, GenericItemPageFieldComponent, TruncatePipe],
      providers: [
        {provide: ItemDataService, useValue: {}},
        {provide: TruncatableService, useValue: {}},
        {provide: RelationshipService, useValue: {}}
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(JournalComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JournalComponent);
    comp = fixture.componentInstance;
    comp.object = mockItem;
    fixture.detectChanges();
  }));

  for (const key of Object.keys(mockItem.metadata)) {
    it(`should be calling a component with metadata field ${key}`, () => {
      const fields = fixture.debugElement.queryAll(By.css('.item-page-fields'));
      expect(containsFieldInput(fields, key)).toBeTruthy();
    });
  }
});

function containsFieldInput(fields: DebugElement[], metadataKey: string): boolean {
  for (const field of fields) {
    const fieldComp = field.componentInstance;
    if (isNotEmpty(fieldComp.fields)) {
      if (fieldComp.fields.indexOf(metadataKey) > -1) {
        return true;
      }
    }
  }
  return false;
}
