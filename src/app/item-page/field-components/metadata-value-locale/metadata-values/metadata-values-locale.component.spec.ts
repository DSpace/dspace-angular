import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { MetadataValuesLocaleComponent } from './metadata-values-locale.component';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { LocaleService } from '../../../../core/locale/locale.service';

let comp: MetadataValuesLocaleComponent;
let fixture: ComponentFixture<MetadataValuesLocaleComponent>;

const englishValue = 'in english';
const frenchValue = 'en français';
const spanishValue = 'en español';
const defaultValue = 'by default';

const mockMetadata = [
  {
    language: 'en',
    value: englishValue
  },
  {
    language: 'fr',
    value: frenchValue
  },
  {
    language: 'es',
    value: spanishValue
  },
  {
    language: '',
    value: defaultValue
  },
  ] as MetadataValue[];
const mockSeperator = '<br/>';
const mockLabel = 'fake.message';


const localServiceStubEnglish: any = {
  getCurrentLanguageCode(): string { return 'en'; },
};

const localServiceStubFrench: any = {
  getCurrentLanguageCode(): string { return 'fr'; },
};

const localServiceStubGerman: any = {
  getCurrentLanguageCode(): string { return 'de'; },
};

export function setFixtureComponentWithLocalService(localeServiceStub: any, defaultLanguage: string = 'en') {
  TestBed.overrideProvider(LocaleService, {useValue: localeServiceStub});
  fixture = TestBed.createComponent(MetadataValuesLocaleComponent);
  comp = fixture.componentInstance;
  comp.mdValues = mockMetadata;
  comp.separator = mockSeperator;
  comp.label = mockLabel;
  comp.defaultLanguage = defaultLanguage;
  fixture.detectChanges();
}

describe('MetadataValuesLocaleComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [MetadataValuesLocaleComponent],
      providers: [{ provide: LocaleService, useValue: {} },],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(MetadataValuesLocaleComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  it('should display english metadata value with english locale', () => {
    setFixtureComponentWithLocalService(localServiceStubEnglish);
    const innerHTML = fixture.nativeElement.innerHTML;
    expect(innerHTML).toContain(englishValue);
  });

  it('should display french metadata value with french locale', () => {
    setFixtureComponentWithLocalService(localServiceStubFrench);
    const innerHTML = fixture.nativeElement.innerHTML;
    expect(innerHTML).toContain(frenchValue);
  });

  it('should display default language metadata value if locale is not available', () => {
    setFixtureComponentWithLocalService(localServiceStubGerman, 'en');
    const innerHTML = fixture.nativeElement.innerHTML;
    expect(innerHTML).toContain(englishValue);
  });

  it('should display empty language metadata value if both locale and default language are not availables', () => {
    setFixtureComponentWithLocalService(localServiceStubGerman, 'fi');
    const innerHTML = fixture.nativeElement.innerHTML;
    expect(innerHTML).toContain(defaultValue);
  });

});


