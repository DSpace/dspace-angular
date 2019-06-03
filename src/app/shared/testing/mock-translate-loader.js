import { of as observableOf } from 'rxjs';
var MockTranslateLoader = /** @class */ (function () {
    function MockTranslateLoader() {
    }
    MockTranslateLoader.prototype.getTranslation = function (lang) {
        return observableOf({});
    };
    return MockTranslateLoader;
}());
export { MockTranslateLoader };
//# sourceMappingURL=mock-translate-loader.js.map