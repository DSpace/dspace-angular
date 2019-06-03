import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { renderStartsWithFor, StartsWithType } from '../starts-with-decorator';
import { StartsWithAbstractComponent } from '../starts-with-abstract.component';
import { hasValue } from '../../empty.util';
/**
 * A switchable component rendering StartsWith options for the type "Date".
 * The options are rendered in a dropdown with an input field (of type number) next to it.
 */
var StartsWithDateComponent = /** @class */ (function (_super) {
    tslib_1.__extends(StartsWithDateComponent, _super);
    function StartsWithDateComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Currently selected month
         */
        _this.startsWithMonth = 'none';
        return _this;
    }
    StartsWithDateComponent.prototype.ngOnInit = function () {
        this.monthOptions = [
            'none',
            'january',
            'february',
            'march',
            'april',
            'may',
            'june',
            'july',
            'august',
            'september',
            'october',
            'november',
            'december'
        ];
        _super.prototype.ngOnInit.call(this);
    };
    /**
     * Set the startsWith by event
     * @param event
     */
    StartsWithDateComponent.prototype.setStartsWithYearEvent = function (event) {
        this.startsWithYear = +event.target.value;
        this.setStartsWithYearMonth();
        this.setStartsWithParam();
    };
    /**
     * Set the startsWithMonth by event
     * @param event
     */
    StartsWithDateComponent.prototype.setStartsWithMonthEvent = function (event) {
        this.startsWithMonth = event.target.value;
        this.setStartsWithYearMonth();
        this.setStartsWithParam();
    };
    /**
     * Get startsWith year combined with month;
     * Returned value: "{{year}}-{{month}}"
     */
    StartsWithDateComponent.prototype.getStartsWith = function () {
        var month = this.getStartsWithMonth();
        if (month > 0 && hasValue(this.startsWithYear) && this.startsWithYear !== -1) {
            var twoDigitMonth = '' + month;
            if (month < 10) {
                twoDigitMonth = "0" + month;
            }
            return this.startsWithYear + "-" + twoDigitMonth;
        }
        else {
            if (hasValue(this.startsWithYear) && this.startsWithYear > 0) {
                return '' + this.startsWithYear;
            }
            else {
                return undefined;
            }
        }
    };
    /**
     * Set startsWith year combined with month;
     */
    StartsWithDateComponent.prototype.setStartsWithYearMonth = function () {
        this.startsWith = this.getStartsWith();
    };
    /**
     * Set the startsWith by string
     * This method also sets startsWithYear and startsWithMonth correctly depending on the received value
     * - When startsWith contains a "-", the first part is considered the year, the second part the month
     * - When startsWith doesn't contain a "-", the whole string is expected to be the year
     * startsWithMonth will be set depending on the index received after the "-"
     * @param startsWith
     */
    StartsWithDateComponent.prototype.setStartsWith = function (startsWith) {
        this.startsWith = startsWith;
        if (hasValue(startsWith) && startsWith.indexOf('-') > -1) {
            var split = startsWith.split('-');
            this.startsWithYear = +split[0];
            var month = +split[1];
            if (month < this.monthOptions.length) {
                this.startsWithMonth = this.monthOptions[month];
            }
            else {
                this.startsWithMonth = this.monthOptions[0];
            }
        }
        else {
            this.startsWithYear = +startsWith;
        }
        this.setStartsWithParam();
    };
    /**
     * Get startsWithYear as a number;
     */
    StartsWithDateComponent.prototype.getStartsWithYear = function () {
        return this.startsWithYear;
    };
    /**
     * Get startsWithMonth as a number;
     */
    StartsWithDateComponent.prototype.getStartsWithMonth = function () {
        return this.monthOptions.indexOf(this.startsWithMonth);
    };
    StartsWithDateComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-starts-with-date',
            styleUrls: ['./starts-with-date.component.scss'],
            templateUrl: './starts-with-date.component.html'
        }),
        renderStartsWithFor(StartsWithType.date)
    ], StartsWithDateComponent);
    return StartsWithDateComponent;
}(StartsWithAbstractComponent));
export { StartsWithDateComponent };
//# sourceMappingURL=starts-with-date.component.js.map