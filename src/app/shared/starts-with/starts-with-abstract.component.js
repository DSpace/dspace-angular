import * as tslib_1 from "tslib";
import { Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { hasValue } from '../empty.util';
/**
 * An abstract component to render StartsWith options
 */
var StartsWithAbstractComponent = /** @class */ (function () {
    function StartsWithAbstractComponent(startsWithOptions, route, router) {
        this.startsWithOptions = startsWithOptions;
        this.route = route;
        this.router = router;
        /**
         * List of subscriptions
         */
        this.subs = [];
    }
    StartsWithAbstractComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subs.push(this.route.queryParams.subscribe(function (params) {
            if (hasValue(params.startsWith)) {
                _this.setStartsWith(params.startsWith);
            }
        }));
        this.formData = new FormGroup({
            startsWith: new FormControl()
        });
    };
    /**
     * Get startsWith
     */
    StartsWithAbstractComponent.prototype.getStartsWith = function () {
        return this.startsWith;
    };
    /**
     * Set the startsWith by event
     * @param event
     */
    StartsWithAbstractComponent.prototype.setStartsWithEvent = function (event) {
        this.startsWith = event.target.value;
        this.setStartsWithParam();
    };
    /**
     * Set the startsWith by string
     * @param startsWith
     */
    StartsWithAbstractComponent.prototype.setStartsWith = function (startsWith) {
        this.startsWith = startsWith;
        this.setStartsWithParam();
    };
    /**
     * Add/Change the url query parameter startsWith using the local variable
     */
    StartsWithAbstractComponent.prototype.setStartsWithParam = function () {
        if (this.startsWith === '-1') {
            this.startsWith = undefined;
        }
        this.router.navigate([], {
            queryParams: Object.assign({ startsWith: this.startsWith }),
            queryParamsHandling: 'merge'
        });
    };
    /**
     * Submit the form data. Called when clicking a submit button on the form.
     * @param data
     */
    StartsWithAbstractComponent.prototype.submitForm = function (data) {
        this.startsWith = data.startsWith;
        this.setStartsWithParam();
    };
    StartsWithAbstractComponent.prototype.ngOnDestroy = function () {
        this.subs.filter(function (sub) { return hasValue(sub); }).forEach(function (sub) { return sub.unsubscribe(); });
    };
    StartsWithAbstractComponent = tslib_1.__decorate([
        tslib_1.__param(0, Inject('startsWithOptions')),
        tslib_1.__metadata("design:paramtypes", [Array, ActivatedRoute,
            Router])
    ], StartsWithAbstractComponent);
    return StartsWithAbstractComponent;
}());
export { StartsWithAbstractComponent };
//# sourceMappingURL=starts-with-abstract.component.js.map