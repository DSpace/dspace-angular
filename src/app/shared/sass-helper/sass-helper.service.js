import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { keySelector } from '../../app.reducer';
import { select, Store } from '@ngrx/store';
import { GLOBAL_CONFIG } from '../../../config';
import { AddCSSVariableAction } from './sass-helper.actions';
var CSSVariableService = /** @class */ (function () {
    function CSSVariableService(store, EnvConfig) {
        this.store = store;
        this.EnvConfig = EnvConfig;
    }
    CSSVariableService.prototype.addCSSVariable = function (name, value) {
        this.store.dispatch(new AddCSSVariableAction(name, value));
    };
    CSSVariableService.prototype.getVariable = function (name) {
        return this.store.pipe(select(themeVariableByNameSelector(name)));
    };
    CSSVariableService.prototype.getAllVariables = function () {
        return this.store.pipe(select(themeVariablesSelector));
    };
    CSSVariableService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(1, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Store, Object])
    ], CSSVariableService);
    return CSSVariableService;
}());
export { CSSVariableService };
var themeVariablesSelector = function (state) { return state.cssVariables; };
var themeVariableByNameSelector = function (name) {
    return keySelector(name, themeVariablesSelector);
};
//# sourceMappingURL=sass-helper.service.js.map