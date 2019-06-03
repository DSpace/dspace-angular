import { ProtractorPage } from './pagenotfound.po';
describe('protractor PageNotFound', function () {
    var page;
    beforeEach(function () {
        page = new ProtractorPage();
    });
    it('should contain element ds-pagenotfound when navigating to page that doesnt exist', function () {
        page.navigateToNonExistingPage();
        expect(page.elementTagExists('ds-pagenotfound')).toEqual(true);
    });
    it('should not contain element ds-pagenotfound when navigating to existing page', function () {
        page.navigateToExistingPage();
        expect(page.elementTagExists('ds-pagenotfound')).toEqual(false);
    });
});
//# sourceMappingURL=pagenotfound.e2e-spec.js.map