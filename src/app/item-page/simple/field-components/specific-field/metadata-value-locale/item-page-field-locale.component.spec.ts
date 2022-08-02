import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Item } from '../../../../../core/shared/item.model';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { ItemPageFieldLocaleComponent } from './item-page-field-locale.component';
import { MetadataValuesLocaleComponent } from '../../../../field-components/metadata-value-locale/metadata-values/metadata-values-locale.component';
import { MetadataMap, MetadataValue } from '../../../../../core/shared/metadata.models';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { createPaginatedList } from '../../../../../shared/testing/utils.test';
import { LocaleService } from '../../../../../core/locale/locale.service';

let comp: ItemPageFieldLocaleComponent;
let fixture: ComponentFixture<ItemPageFieldLocaleComponent>;

const mockValue = 'test value';
const mockField = 'dc.test';
const mockLabel = 'test label';
const mockFields = [mockField];

const localServiceStubEnglish: any = {
  getCurrentLanguageCode() { return 'en'; },
};

describe('ItemPageFieldLocaleComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [ItemPageFieldLocaleComponent, MetadataValuesLocaleComponent],
      providers: [{ provide: LocaleService, useValue: localServiceStubEnglish },],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemPageFieldLocaleComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemPageFieldLocaleComponent);
    comp = fixture.componentInstance;
    comp.item = mockItemWithMetadataFieldAndValue(mockField, mockValue);
    comp.fields = mockFields;
    comp.label = mockLabel;
    fixture.detectChanges();
  }));

  it('should display the correct metadata value', () => {
    expect(fixture.nativeElement.innerHTML).toContain(mockValue);
  });
});

export function mockItemWithMetadataFieldAndValue(field: string, value: string): Item {
  const item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: new MetadataMap()
  });
  item.metadata[field] = [{
    language: 'en',
    value: value
  }] as MetadataValue[];
  return item;
}
