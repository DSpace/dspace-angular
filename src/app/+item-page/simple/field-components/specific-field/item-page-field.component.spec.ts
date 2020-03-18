import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Item } from '../../../../core/shared/item.model';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { ItemPageFieldComponent } from './item-page-field.component';
import { MetadataValuesComponent } from '../../../field-components/metadata-values/metadata-values.component';
import { MetadataMap, MetadataValue } from '../../../../core/shared/metadata.models';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';

let comp: ItemPageFieldComponent;
let fixture: ComponentFixture<ItemPageFieldComponent>;

const mockValue = 'test value';
const mockField = 'dc.test';
const mockLabel = 'test label';
const mockFields = [mockField];

describe('ItemPageFieldComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [ItemPageFieldComponent, MetadataValuesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemPageFieldComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemPageFieldComponent);
    comp = fixture.componentInstance;
    comp.item = mockItemWithMetadataFieldAndValue(mockField, mockValue);
    comp.fields = mockFields;
    comp.label = mockLabel;
    fixture.detectChanges();
  }));

  it('should display display the correct metadata value', () => {
    expect(fixture.nativeElement.innerHTML).toContain(mockValue);
  });
});

export function mockItemWithMetadataFieldAndValue(field: string, value: string): Item {
  const item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
    metadata: new MetadataMap()
  });
  item.metadata[field] = [{
    language: 'en_US',
    value: value
  }] as MetadataValue[];
  return item;
}
