import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ValuepairComponent } from './valuepair.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../../../shared/mocks/translate-loader.mock';
import { VocabularyService } from '../../../../../../../core/submission/vocabularies/vocabulary.service';
import { Item } from '../../../../../../../core/shared/item.model';
import { EMPTY, of } from 'rxjs';
import { AuthService } from '../../../../../../../core/auth/auth.service';
import { AuthServiceStub } from '../../../../../../../shared/testing/auth-service.stub';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { DsDatePipe } from '../../../../../../pipes/ds-date.pipe';

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
          { value: 'en', authority: null }
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
    valuesInline: false
  };

  const testField2 = {
    metadata: METADATA_KEY_2,
    label: 'Type',
    rendering: 'valuepair.' + VOCABULARY_NAME_2,
    fieldType: 'METADATA',
    metadataGroup: null,
    labelAsHeading: false,
    valuesInline: false
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
      { getPublicVocabularyEntryByValue: EMPTY, getPublicVocabularyEntryByID: EMPTY }
    );

  describe('when the vocabulary has no authority', () => {

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock
            }
          }),
        ],
        declarations: [ValuepairComponent, DsDatePipe],
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
              useClass: TranslateLoaderMock
            }
          }),
        ],
        declarations: [ValuepairComponent, DsDatePipe],
        providers: [
          { provide: VocabularyService, useValue: vocabularyServiceSpy },
          { provide: AuthService, useValue: authService },
          { provide: 'fieldProvider', useValue: testField2 },
          { provide: 'itemProvider', useValue: testItem2 },
          { provide: 'metadataValueProvider', useValue: {value: undefined, authority: VOCABULARY_NAME_2 + ':asd' } },
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

});
