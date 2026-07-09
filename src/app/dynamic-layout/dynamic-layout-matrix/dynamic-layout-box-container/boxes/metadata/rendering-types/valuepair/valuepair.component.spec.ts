import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { AuthService } from '@dspace/core/auth/auth.service';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { VocabularyService } from '@dspace/core/submission/vocabularies/vocabulary.service';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  EMPTY,
  of,
} from 'rxjs';

import MetadataValue from '../../../../../../../core/shared/metadata.models';
import { DsDatePipe } from '../../../../../../pipes/ds-date.pipe';
import { ValuepairComponent } from './valuepair.component';

const METADATA_KEY_1 = 'person.knowsLanguage';
const METADATA_KEY_2 = 'dc.type';

const VOCABULARY_NAME_1 = 'common_iso_languages';
const VOCABULARY_NAME_2 = 'types';

describe('ValuepairComponent', () => {

  let component: ValuepairComponent;
  let fixture: ComponentFixture<ValuepairComponent>;

  let vocabularyService: VocabularyService;
  const authService = new AuthServiceStub();

  const allMetadata = (key: string) => {
    switch (key) {
      case METADATA_KEY_1:
        return [
          { value: 'it', authority: null },
          { value: 'en', authority: null },
        ];
      case METADATA_KEY_2:
        return [
          { value: undefined, authority: VOCABULARY_NAME_2 + ':asd' },
          { value: undefined, authority: VOCABULARY_NAME_2 + ':fgh' },
        ];
      default:
        return [];
    }
  };

  const testItem1 = Object.assign(new Item(), {
    allMetadata: () => allMetadata(METADATA_KEY_1),
  });

  const testItem2 = Object.assign(new Item(), {
    allMetadata: () => allMetadata(METADATA_KEY_2),
  });

  const testField1: LayoutField = {
    metadata: METADATA_KEY_1,
    label: 'Knows Language',
    rendering: 'valuepair.' + VOCABULARY_NAME_1,
    fieldType: 'METADATA',
    metadataGroup: null,
    labelAsHeading: false,
    valuesInline: false,
  };

  const testField2 = {
    metadata: METADATA_KEY_2,
    label: 'Type',
    rendering: 'valuepair.' + VOCABULARY_NAME_2,
    fieldType: 'METADATA',
    metadataGroup: null,
    labelAsHeading: false,
    valuesInline: false,
  };

  const vocabularyEntriesMock = (vocabularyName, value) => {
    switch (vocabularyName + '/' + value) {
      case 'common_iso_languages/it':
        return of('Italian');
      case 'common_iso_languages/en':
        return of('English');
      case 'types/types:asd':
        return of('Value');
      default:
        return EMPTY;
    }
  };

  const vocabularyServiceSpy =
    jasmine.createSpyObj(
      'vocabularyService',
      { getPublicVocabularyEntryByValue: EMPTY, getPublicVocabularyEntryByID: EMPTY },
    );

  describe('when the vocabulary has no authority', () => {

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
          ValuepairComponent, DsDatePipe,
        ],
        providers: [
          { provide: VocabularyService, useValue: vocabularyServiceSpy },
          { provide: AuthService, useValue: authService },
          { provide: 'fieldProvider', useValue: testField1 },
          { provide: 'itemProvider', useValue: testItem1 },
          { provide: 'metadataValueProvider', useValue: { value: 'it', authority: null } },
          { provide: 'renderingSubTypeProvider', useValue: VOCABULARY_NAME_1 },
          { provide: 'tabNameProvider', useValue: '' },
        ],
      }).compileComponents();

      vocabularyService = TestBed.inject(VocabularyService);

    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ValuepairComponent);
      component = fixture.componentInstance;
      vocabularyServiceSpy.getPublicVocabularyEntryByValue.and.callFake(vocabularyEntriesMock);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });


    it('should ...', () => {
      expect(vocabularyService.getPublicVocabularyEntryByValue).toHaveBeenCalledWith(VOCABULARY_NAME_1, 'it');
    });


  });


  describe('when the vocabulary has an authority', () => {

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
          ValuepairComponent, DsDatePipe,
        ],
        providers: [
          { provide: VocabularyService, useValue: vocabularyServiceSpy },
          { provide: AuthService, useValue: authService },
          { provide: 'fieldProvider', useValue: testField2 },
          { provide: 'itemProvider', useValue: testItem2 },
          { provide: 'metadataValueProvider', useValue: { value: undefined, authority: VOCABULARY_NAME_2 + ':asd' } },
          { provide: 'renderingSubTypeProvider', useValue: VOCABULARY_NAME_2 },
          { provide: 'tabNameProvider', useValue: '' },
        ],
      }).compileComponents();

      vocabularyService = TestBed.inject(VocabularyService);

    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ValuepairComponent);
      component = fixture.componentInstance;
      vocabularyServiceSpy.getPublicVocabularyEntryByID.and.callFake(vocabularyEntriesMock);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });


    it('should ...', () => {
      expect(vocabularyService.getPublicVocabularyEntryByID).toHaveBeenCalledWith(VOCABULARY_NAME_2, `${VOCABULARY_NAME_2}:asd`);
    });


  });

  describe('when the metadata value is a link', () => {
    const linkValue = 'https://example.com';
    const testFieldLink: LayoutField = {
      metadata: 'dc.identifier',
      label: 'Identifier',
      rendering: 'valuepair.' + VOCABULARY_NAME_2,
      fieldType: 'METADATA',
      metadataGroup: null,
      labelAsHeading: false,
      valuesInline: false,
    };

    const testItemLink = Object.assign(new Item(), {
      allMetadata: () => [{ value: linkValue, authority: null }],
    });

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
          ValuepairComponent,
          DsDatePipe,
        ],
        providers: [
          { provide: VocabularyService, useValue: vocabularyServiceSpy },
          { provide: AuthService, useValue: authService },
          { provide: 'fieldProvider', useValue: testFieldLink },
          { provide: 'itemProvider', useValue: testItemLink },
          { provide: 'metadataValueProvider', useValue: { value: linkValue, authority: null } },
          { provide: 'renderingSubTypeProvider', useValue: '' }, // leave empty
          { provide: 'tabNameProvider', useValue: '' },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ValuepairComponent);
      component = fixture.componentInstance;
      component.metadataValue = Object.assign(new MetadataValue(), {
        value: linkValue,
      });
      component.value$.next(linkValue);

      fixture.detectChanges();
    });

    it('should detect that the value is a link', () => {
      expect(component.isMetadataLink).toBeTrue();
    });

    it('should render the value as an <a> tag', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const linkEl = compiled.querySelector('a.text-value') as HTMLAnchorElement;

      expect(linkEl).toBeTruthy();
      expect(linkEl.href).toBe(linkValue + '/');
      expect(linkEl.textContent.trim()).toBe(linkValue);
    });
  });


});
