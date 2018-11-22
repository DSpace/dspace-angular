import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockTranslateLoader } from '../../../shared/mocks/mock-translate-loader';
import { MetadataValuesComponent } from './metadata-values.component';
import { By } from '@angular/platform-browser';

let comp: MetadataValuesComponent;
let fixture: ComponentFixture<MetadataValuesComponent>;

const mockMetadata = [
  {
    key: 'journal.identifier.issn',
    language: 'en_US',
    value: '1234'
  },
  {
    key: 'journal.publisher',
    language: 'en_US',
    value: 'a publisher'
  },
  {
    key: 'journal.identifier.description',
    language: 'en_US',
    value: 'desc'
  }];
const mockSeperator = '<br/>';
const mockLabel = 'fake.message';

describe('MetadataValuesComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: MockTranslateLoader
        }
      })],
      declarations: [MetadataValuesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(MetadataValuesComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MetadataValuesComponent);
    comp = fixture.componentInstance;
    comp.values = mockMetadata;
    comp.separator = mockSeperator;
    comp.label = mockLabel;
    fixture.detectChanges();
  }));

  it('should display all metadata values', () => {
    const innerHTML = fixture.nativeElement.innerHTML;
    for (const metadatum of mockMetadata) {
      expect(innerHTML).toContain(metadatum.value);
    }
  });

  it('should contain separators equal to the amount of metadata values minus one', () => {
    const separators = fixture.debugElement.queryAll(By.css('span>span'));
    expect(separators.length).toBe(mockMetadata.length - 1);
  });

});
