import { browser, element, by } from 'protractor';
var ProtractorPage = /** @class */ (function () {
    function ProtractorPage() {
    }
    ProtractorPage.prototype.navigateTo = function () {
        return browser.get('/');
    };
    ProtractorPage.prototype.getPageTitleText = function () {
        return browser.getTitle();
    };
    ProtractorPage.prototype.getHomePageNewsText = function () {
        return element(by.xpath('//ds-home-news')).getText();
    };
    return ProtractorPage;
}());
export { ProtractorPage };
//# sourceMappingURL=app.po.js.map