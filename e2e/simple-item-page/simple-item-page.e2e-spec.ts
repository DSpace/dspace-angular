import { ProtractorPage } from './simple-item-page.po';

describe('protractor Simple Item Page', function() {
    let page: ProtractorPage;

    beforeEach(() => {
        page = new ProtractorPage();
        page.navigateToSimpleItemPage();
    });

    it('should contain element ds-thumbnail"', () => {
        expect(page.elementTagExists("ds-thumbnail")).toEqual(true);
    });

    it('should contain element h1.item-page-title-field"', () => {
        expect(page.elementSelectorExists("h1.selector")).toEqual(true);
    });

});
