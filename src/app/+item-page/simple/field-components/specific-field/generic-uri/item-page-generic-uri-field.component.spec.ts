import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockTranslateLoader } from '../../../../../shared/testing/mock-translate-loader';
import { mockItemWithMetadataFieldAndValue } from '../item-page-field.component.spec';
import { ItemPageGenericUriFieldComponent } from './item-page-generic-uri-field.component';
import { MetadataUriValuesComponent } from '../../../../field-components/metadata-uri-values/metadata-uri-values.component';

let comp: ItemPageGenericUriFieldComponent;
let fixture: ComponentFixture<ItemPageGenericUriFieldComponent>;

const mockField = 'dc.relation.haspart';
const mockValue = 'test value';
const mockLabel = 'test label';

describe('ItemPageGenericUriFieldComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: MockTranslateLoader
        }
      })],
      declarations: [ItemPageGenericUriFieldComponent, MetadataUriValuesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemPageGenericUriFieldComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemPageGenericUriFieldComponent);
    comp = fixture.componentInstance;
    comp.item = mockItemWithMetadataFieldAndValue(mockField, mockValue);
    comp.fields = [mockField];
    comp.label = mockLabel;
    fixture.detectChanges();
  }));

  it('should display display the correct metadata value', () => {
    expect(fixture.nativeElement.innerHTML).toContain(mockValue);
  });
});
