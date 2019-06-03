import { ProtractorPage } from './search-page.po';
import { browser } from 'protractor';
describe('protractor SearchPage', function () {
    var page;
    beforeEach(function () {
        page = new ProtractorPage();
    });
    it('should contain query value when navigating to page with query parameter', function () {
        var queryString = 'Interesting query string';
        page.navigateToSearchWithQueryParameter(queryString);
        page.getCurrentQuery().then(function (query) {
            expect(query).toEqual(queryString);
        });
    });
    it('should have right scope selected when navigating to page with scope parameter', function () {
        var scope = page.getRandomScopeOption();
        scope.then(function (scopeString) {
            page.navigateToSearchWithScopeParameter(scopeString);
            page.getCurrentScope().then(function (s) {
                expect(s).toEqual(scopeString);
            });
        });
    });
    it('should redirect to the correct url when scope was set and submit button was triggered', function () {
        var scope = page.getRandomScopeOption();
        scope.then(function (scopeString) {
            page.setCurrentScope(scopeString);
            page.submitSearchForm();
            browser.wait(function () {
                return browser.getCurrentUrl().then(function (url) {
                    return url.indexOf('scope=' + encodeURI(scopeString)) !== -1;
                });
            });
        });
    });
    it('should redirect to the correct url when query was set and submit button was triggered', function () {
        var queryString = 'Another interesting query string';
        page.setCurrentQuery(queryString);
        page.submitSearchForm();
        browser.wait(function () {
            return browser.getCurrentUrl().then(function (url) {
                return url.indexOf('query=' + encodeURI(queryString)) !== -1;
            });
        });
    });
});
//# sourceMappingURL=search-page.e2e-spec.js.map