import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ValuepairComponent } from './valuepair.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../../../shared/mocks/translate-loader.mock';
import { VocabularyService } from '../../../../../../../core/submission/vocabularies/vocabulary.service';
import { Item } from '../../../../../../../core/shared/item.model';
import { EMPTY, of } from 'rxjs';
import {AuthService} from '../../../../../../../core/auth/auth.service';
import {AuthServiceStub} from '../../../../../../../shared/testing/auth-service.stub';
import {LayoutField} from '../../../../../../../core/layout/models/box.model';

const METADATA_KEY_1 = 'person.knowsLanguage';
const METADATA_KEY_2 = 'dc.type';

const VOCABULARY_NAME_1 = 'common_iso_languages';
const VOCABULARY_NAME_2 = 'types';

xdescribe('ValuepairComponent', () => {

  let component: ValuepairComponent;
  let fixture: ComponentFixture<ValuepairComponent>;

  let vocabularyService: VocabularyService;
  const authService = new AuthServiceStub();

  const allMetadata = (key: string) => {
    switch (key) {
      case METADATA_KEY_1:
        return [
          {
            value: 'it',
            authority: null,
          },
          {
            value: 'en',
            authority: null,
          }
        ];
      case METADATA_KEY_2:
        return [
          {
            value: undefined,
            authority: VOCABULARY_NAME_2 + ':asd',
          },
          {
            value: undefined,
            authority: VOCABULARY_NAME_2 + ':fgh',
          },
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
      case 'types':
        return of('Value');
      default:
        return EMPTY;
    }
  };

  const vocabularyServiceSpy = jasmine.createSpyObj('vocabularyService', { getPublicVocabularyEntryByValue: EMPTY });

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
      declarations: [ValuepairComponent],
      providers: [
        {provide: VocabularyService, useValue: vocabularyServiceSpy}
      ],
    }).compileComponents();

    vocabularyService = TestBed.inject(VocabularyService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuepairComponent);
    component = fixture.componentInstance;
  });


  describe('when the vocabulary has no authority', () => {

    // test item 1

    beforeEach(() => {
      component.item = testItem1;
      component.field = testField1;
      component.renderingSubType = VOCABULARY_NAME_1;
      // vocabularyServiceSpy.getPublicVocabularyEntryByValue.and.callFake(vocabularyEntriesMock);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });


    it('should ...', () => {
      expect(vocabularyService.getPublicVocabularyEntryByValue).toHaveBeenCalledWith(VOCABULARY_NAME_1, 'it');
      expect(vocabularyService.getPublicVocabularyEntryByValue).toHaveBeenCalledWith(VOCABULARY_NAME_1, 'en');
    });

  });

  describe('when the vocabulary has an authority', () => {

    // test item 2

    beforeEach(() => {
      component.item = testItem2;
      component.field = testField2;
      component.renderingSubType = VOCABULARY_NAME_2;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should ...', () => {
      expect(vocabularyService.getPublicVocabularyEntryByValue).toHaveBeenCalledWith(VOCABULARY_NAME_2, 'asd');
      expect(vocabularyService.getPublicVocabularyEntryByValue).toHaveBeenCalledWith(VOCABULARY_NAME_2, 'fgh');
    });

  });
});
