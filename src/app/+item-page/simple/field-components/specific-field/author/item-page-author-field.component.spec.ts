import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoaderMock } from '../../../../../shared/testing/translate-loader.mock';
import { MetadataValuesComponent } from '../../../../field-components/metadata-values/metadata-values.component';
import { mockItemWithMetadataFieldAndValue } from '../item-page-field.component.spec';
import { ItemPageAuthorFieldComponent } from './item-page-author-field.component';

let comp: ItemPageAuthorFieldComponent;
let fixture: ComponentFixture<ItemPageAuthorFieldComponent>;

const mockFields = ['dc.contributor.author', 'dc.creator', 'dc.contributor'];
const mockValue = 'test value';

describe('ItemPageAuthorFieldComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [ItemPageAuthorFieldComponent, MetadataValuesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemPageAuthorFieldComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  for (const field of mockFields) {
    beforeEach(async(() => {
      fixture = TestBed.createComponent(ItemPageAuthorFieldComponent);
      comp = fixture.componentInstance;
      comp.item = mockItemWithMetadataFieldAndValue(field, mockValue);
      fixture.detectChanges();
    }));

    describe(`when the item contains metadata for ${field}`, () => {
      it('should display display the correct metadata value', () => {
        expect(fixture.nativeElement.innerHTML).toContain(mockValue);
      });
    });
  }
});
