import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { GLOBAL_CONFIG } from '../../../config';
import { TranslateService } from '@ngx-translate/core';
var LangSwitchComponent = /** @class */ (function () {
    function LangSwitchComponent(config, translate) {
        this.config = config;
        this.translate = translate;
    }
    LangSwitchComponent.prototype.ngOnInit = function () {
        this.activeLangs = this.config.languages.filter(function (MyLangConfig) { return MyLangConfig.active === true; });
        this.moreThanOneLanguage = (this.activeLangs.length > 1);
    };
    /**
     * Returns the label for the current language
     */
    LangSwitchComponent.prototype.currentLangLabel = function () {
        var _this = this;
        return this.activeLangs.find(function (MyLangConfig) { return MyLangConfig.code === _this.translate.currentLang; }).label;
    };
    /**
     * Returns the label for a specific language code
     */
    LangSwitchComponent.prototype.langLabel = function (langcode) {
        return this.activeLangs.find(function (MyLangConfig) { return MyLangConfig.code === langcode; }).label;
    };
    LangSwitchComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-lang-switch',
            styleUrls: ['lang-switch.component.scss'],
            templateUrl: 'lang-switch.component.html',
        })
        /**
         * Component representing a switch for changing the interface language throughout the application
         * If only one language is active, the component will disappear as there are no languages to switch to.
         */
        ,
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, TranslateService])
    ], LangSwitchComponent);
    return LangSwitchComponent;
}());
export { LangSwitchComponent };
//# sourceMappingURL=lang-switch.component.js.map