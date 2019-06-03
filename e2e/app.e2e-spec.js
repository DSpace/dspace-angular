import { ProtractorPage } from './app.po';
describe('protractor App', function () {
    var page;
    beforeEach(function () {
        page = new ProtractorPage();
    });
    it('should display translated title "DSpace Angular :: Home"', function () {
        page.navigateTo();
        expect(page.getPageTitleText()).toEqual('DSpace Angular :: Home');
    });
    it('should contain a news section', function () {
        page.navigateTo();
        expect(page.getHomePageNewsText()).toBeDefined();
    });
});
//# sourceMappingURL=app.e2e-spec.js.map