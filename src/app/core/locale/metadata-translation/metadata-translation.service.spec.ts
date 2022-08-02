import { MetadataTranslationService } from './metadata-translation.service';
import { DSpaceObject } from '../../shared/dspace-object.model';

describe('MetadataTranslationService', () => {
    let testedService: MetadataTranslationService;

    const dcKey = 'dc.title';
    const englishTitle = 'english title';
    const frenchTitle = 'titre français';
    const spanishTitle = 'titulo español';
    const emptyLanguageTitle = 'empty language title';

    const dso = Object.assign(new DSpaceObject(), {
        metadata: {
            'dc.title': [
                { value: englishTitle, language: 'en' },
                { value: frenchTitle, language: 'fr' },
                { value: spanishTitle, language: 'es' },
                { value: emptyLanguageTitle }
            ],
            'other.key': [{ value: 'other value' }],
            'other.en.key': [{ value: 'other en value', language: 'en' }]
        }
    });

    const dsoNoEnglishNoFrench = Object.assign(new DSpaceObject(), {
        metadata: {
            'dc.title': [
                { value: spanishTitle, language: 'es' },
                { value: emptyLanguageTitle }
            ],
            'other.key': [{ value: 'other value' }],
            'other.en.key': [{ value: 'other en value', language: 'en' }]
        }
    });

    const localServiceStubFrench: any = {
        getCurrentLanguageCode(): string { return 'fr'; },
    };
    const localServiceStubEnglish: any = {
        getCurrentLanguageCode(): string { return 'en'; },
    };
    const localServiceStubGerman: any = {
        getCurrentLanguageCode(): string { return 'de'; },
    };

    beforeEach(() => {
        testedService = new MetadataTranslationService(localServiceStubFrench);
    });

    describe('currentLanguageValue', () => {
        it('should return metadata value for the current language code', () => {
            let value = testedService.currentLanguageValue(dso, dcKey);
            expect(value).toEqual(frenchTitle);
        });
    });

    describe('defaultLanguageValue', () => {
        it('should return metadata value for the default language code', () => {
            let value = testedService.defaultLanguageValue(dso, dcKey);
            expect(value).toEqual(englishTitle);
        });
    });

    describe('emptyLanguageValue', () => {
        it('should return metadata value without language code', () => {
            let value = testedService.emptyLanguageValue(dso, dcKey);
            expect(value).toEqual(emptyLanguageTitle);
        });
    });

    describe('currentLanguageValueOrDefault', () => {
        it('should return english metadata value with english locale', () => {
            testedService = new MetadataTranslationService(localServiceStubEnglish);
            let value = testedService.currentLanguageValueOrDefault(dso, dcKey);
            expect(value).toEqual(englishTitle);
        });
        it('should return french metadata value with french locale', () => {
            let value = testedService.currentLanguageValueOrDefault(dso, dcKey);
            expect(value).toEqual(frenchTitle);
        });
        it('should display default language metadata value if locale is not available', () => {
            testedService = new MetadataTranslationService(localServiceStubGerman);
            let value = testedService.currentLanguageValueOrDefault(dso, dcKey);
            expect(value).toEqual(englishTitle);
        });
        it('should display empty language metadata value if both locale and default language are not availables', () => {
            let value = testedService.currentLanguageValueOrDefault(dsoNoEnglishNoFrench, dcKey);
            expect(value).toEqual(emptyLanguageTitle);
        });

    });

});
