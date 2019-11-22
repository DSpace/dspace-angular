import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockTranslateLoader } from '../../../../../shared/testing/mock-translate-loader';
import { mockItemWithMetadataFieldAndValue } from '../item-page-field.component.spec';
import { ItemPageUriFieldComponent } from './item-page-uri-field.component';
import { MetadataUriValuesComponent } from '../../../../field-components/metadata-uri-values/metadata-uri-values.component';

let comp: ItemPageUriFieldComponent;
let fixture: ComponentFixture<ItemPageUriFieldComponent>;

const mockField = 'dc.identifier.uri';
const mockValue = 'test value';

describe('ItemPageUriFieldComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: MockTranslateLoader
        }
      })],
      declarations: [ItemPageUriFieldComponent, MetadataUriValuesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemPageUriFieldComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemPageUriFieldComponent);
    comp = fixture.componentInstance;
    comp.item = mockItemWithMetadataFieldAndValue(mockField, mockValue);
    fixture.detectChanges();
  }));

  it('should display display the correct metadata value', () => {
    expect(fixture.nativeElement.innerHTML).toContain(mockValue);
  });
});
