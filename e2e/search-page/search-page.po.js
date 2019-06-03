import { browser, element, by, protractor } from 'protractor';
var ProtractorPage = /** @class */ (function () {
    function ProtractorPage() {
        this.SEARCH = '/search';
    }
    ProtractorPage.prototype.navigateToSearch = function () {
        return browser.get(this.SEARCH);
    };
    ProtractorPage.prototype.navigateToSearchWithQueryParameter = function (query) {
        return browser.get(this.SEARCH + '?query=' + query);
    };
    ProtractorPage.prototype.navigateToSearchWithScopeParameter = function (scope) {
        return browser.get(this.SEARCH + '?scope=' + scope);
    };
    ProtractorPage.prototype.getCurrentScope = function () {
        var scopeSelect = element(by.css('#search-form select'));
        browser.wait(protractor.ExpectedConditions.presenceOf(scopeSelect), 10000);
        return scopeSelect.getAttribute('value');
    };
    ProtractorPage.prototype.getCurrentQuery = function () {
        return element(by.css('#search-form input')).getAttribute('value');
    };
    ProtractorPage.prototype.setCurrentScope = function (scope) {
        element(by.css('option[value="' + scope + '"]')).click();
    };
    ProtractorPage.prototype.setCurrentQuery = function (query) {
        element(by.css('input[name="query"]')).sendKeys(query);
    };
    ProtractorPage.prototype.submitSearchForm = function () {
        element(by.css('button.search-button')).click();
    };
    ProtractorPage.prototype.getRandomScopeOption = function () {
        var options = element(by.css('select[name="scope"]')).all(by.tagName('option'));
        return options.count().then(function (c) {
            var index = Math.floor(Math.random() * (c - 1));
            return options.get(index + 1).getAttribute('value');
        });
    };
    return ProtractorPage;
}());
export { ProtractorPage };
//# sourceMappingURL=search-page.po.js.map