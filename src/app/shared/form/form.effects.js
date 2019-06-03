import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
var FormEffects = /** @class */ (function () {
    function FormEffects(actions$) {
        this.actions$ = actions$;
    }
    FormEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Actions])
    ], FormEffects);
    return FormEffects;
}());
export { FormEffects };
//# sourceMappingURL=form.effects.js.map