import { browser, element, by } from 'protractor';
var ProtractorPage = /** @class */ (function () {
    function ProtractorPage() {
        this.HOMEPAGE = '/home';
        this.NONEXISTINGPAGE = '/e9019a69-d4f1-4773-b6a3-bd362caa46f2';
    }
    ProtractorPage.prototype.navigateToNonExistingPage = function () {
        return browser.get(this.NONEXISTINGPAGE);
    };
    ProtractorPage.prototype.navigateToExistingPage = function () {
        return browser.get(this.HOMEPAGE);
    };
    ProtractorPage.prototype.elementTagExists = function (tag) {
        return element(by.tagName(tag)).isPresent();
    };
    return ProtractorPage;
}());
export { ProtractorPage };
//# sourceMappingURL=pagenotfound.po.js.map