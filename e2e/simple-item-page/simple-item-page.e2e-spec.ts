import { ProtractorPage } from './simple-item-page.po';

describe('protractor Simple Item Page', function () {
    let page: ProtractorPage;

    beforeEach(() => {
        page = new ProtractorPage();
        page.navigateToSimpleItemPage();
    });

    it('should contain element ds-thumbnail"', () => {
        expect(page.elementSelectorExists("ds-thumbnail img")).toEqual(true);
    });

    it('should contain element an h2 title field"', () => {
        expect(page.elementSelectorExists("h2.item-page-title-field")).toEqual(true);
    });

    it('should contain element link to its collections"', () => {
        expect(page.elementTagExists("ds-item-page-collections")).toEqual(true);
    });

    it('should contain a file section"', () => {
        expect(page.elementTagExists("ds-item-page-file-section")).toEqual(true);
    });

});
