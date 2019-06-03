import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { hasValue, isNotEmpty } from '../empty.util';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
var InputSuggestionsComponent = /** @class */ (function () {
    function InputSuggestionsComponent() {
        /**
         * The suggestions that should be shown
         */
        this.suggestions = [];
        /**
         * The time waited to detect if any other input will follow before requesting the suggestions
         */
        this.debounceTime = 500;
        /**
         * Placeholder attribute for the input field
         */
        this.placeholder = '';
        /**
         * Whether or not the current input is valid
         */
        this.valid = true;
        /**
         * Output for when the form is submitted
         */
        this.submitSuggestion = new EventEmitter();
        /**
         * Output for when a suggestion is clicked
         */
        this.clickSuggestion = new EventEmitter();
        /**
         * Output for when something is typed in the input field
         */
        this.typeSuggestion = new EventEmitter();
        /**
         * Output for when new suggestions should be requested
         */
        this.findSuggestions = new EventEmitter();
        /**
         * Emits true when the list of suggestions should be shown
         */
        this.show = new BehaviorSubject(false);
        /**
         * Index of the currently selected suggestion
         */
        this.selectedIndex = -1;
        /**
         * True when the dropdown should not reopen
         */
        this.blockReopen = false;
        /** Fields needed to add ngModel */
        this.disabled = false;
        this.propagateChange = function (_) {
            /* Empty implementation */
        };
        this.propagateTouch = function (_) {
            /* Empty implementation */
        };
        /* END - Method's needed to add ngModel to a component */
    }
    InputSuggestionsComponent_1 = InputSuggestionsComponent;
    /**
     * When any of the inputs change, check if we should still show the suggestions
     */
    InputSuggestionsComponent.prototype.ngOnChanges = function (changes) {
        if (hasValue(changes.suggestions)) {
            this.show.next(isNotEmpty(changes.suggestions.currentValue) && !changes.suggestions.firstChange);
        }
    };
    /**
     * Move the focus on one of the suggestions up to the previous suggestion
     * When no suggestion is currently in focus OR the first suggestion is in focus: shift to the last suggestion
     */
    InputSuggestionsComponent.prototype.shiftFocusUp = function (event) {
        event.preventDefault();
        if (this.selectedIndex > 0) {
            this.selectedIndex--;
            this.selectedIndex = (this.selectedIndex + this.resultViews.length) % this.resultViews.length; // Prevent negative modulo outcome
        }
        else {
            this.selectedIndex = this.resultViews.length - 1;
        }
        this.changeFocus();
    };
    /**
     * Move the focus on one of the suggestions up to the next suggestion
     * When no suggestion is currently in focus OR the last suggestion is in focus: shift to the first suggestion
     */
    InputSuggestionsComponent.prototype.shiftFocusDown = function (event) {
        event.preventDefault();
        if (this.selectedIndex >= 0) {
            this.selectedIndex++;
            this.selectedIndex %= this.resultViews.length;
        }
        else {
            this.selectedIndex = 0;
        }
        this.changeFocus();
    };
    /**
     * Perform the change of focus to the current selectedIndex
     */
    InputSuggestionsComponent.prototype.changeFocus = function () {
        if (this.resultViews.length > 0) {
            this.resultViews.toArray()[this.selectedIndex].nativeElement.focus();
        }
    };
    /**
     * When any key is pressed (except for the Enter button) the query input should move to the input field
     * @param {KeyboardEvent} event The keyboard event
     */
    InputSuggestionsComponent.prototype.onKeydown = function (event) {
        if (event.key !== 'Enter') {
            this.queryInput.nativeElement.focus();
        }
    };
    /**
     * Changes the show variable so the suggestion dropdown closes
     */
    InputSuggestionsComponent.prototype.close = function () {
        this.show.next(false);
    };
    /**
     * For usage of the isNotEmpty function in the template
     */
    InputSuggestionsComponent.prototype.isNotEmpty = function (data) {
        return isNotEmpty(data);
    };
    /**
     * Make sure that if a suggestion is clicked, the suggestions dropdown closes, does not reopen and the focus moves to the input field
     */
    InputSuggestionsComponent.prototype.onClickSuggestion = function (data) {
        this.value = data;
        this.clickSuggestion.emit(data);
        this.close();
        this.blockReopen = true;
        this.queryInput.nativeElement.focus();
        return false;
    };
    /**
     * Finds new suggestions when necessary
     * @param data The query value to emit
     */
    InputSuggestionsComponent.prototype.find = function (data) {
        if (!this.blockReopen) {
            this.findSuggestions.emit(data);
            this.typeSuggestion.emit(data);
        }
        this.blockReopen = false;
    };
    InputSuggestionsComponent.prototype.onSubmit = function (data) {
        this.value = data;
        this.submitSuggestion.emit(data);
    };
    /* START - Method's needed to add ngModel (ControlValueAccessor) to a component */
    InputSuggestionsComponent.prototype.registerOnChange = function (fn) {
        this.propagateChange = fn;
    };
    InputSuggestionsComponent.prototype.registerOnTouched = function (fn) {
        this.propagateTouch = fn;
    };
    InputSuggestionsComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    InputSuggestionsComponent.prototype.writeValue = function (value) {
        this.value = value;
    };
    Object.defineProperty(InputSuggestionsComponent.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (val) {
            this._value = val;
            this.propagateChange(this._value);
        },
        enumerable: true,
        configurable: true
    });
    var InputSuggestionsComponent_1;
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], InputSuggestionsComponent.prototype, "suggestions", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], InputSuggestionsComponent.prototype, "debounceTime", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], InputSuggestionsComponent.prototype, "placeholder", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], InputSuggestionsComponent.prototype, "action", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], InputSuggestionsComponent.prototype, "name", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], InputSuggestionsComponent.prototype, "valid", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], InputSuggestionsComponent.prototype, "submitSuggestion", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], InputSuggestionsComponent.prototype, "clickSuggestion", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], InputSuggestionsComponent.prototype, "typeSuggestion", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], InputSuggestionsComponent.prototype, "findSuggestions", void 0);
    tslib_1.__decorate([
        ViewChild('inputField'),
        tslib_1.__metadata("design:type", ElementRef)
    ], InputSuggestionsComponent.prototype, "queryInput", void 0);
    tslib_1.__decorate([
        ViewChildren('suggestion'),
        tslib_1.__metadata("design:type", QueryList)
    ], InputSuggestionsComponent.prototype, "resultViews", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], InputSuggestionsComponent.prototype, "disabled", void 0);
    InputSuggestionsComponent = InputSuggestionsComponent_1 = tslib_1.__decorate([
        Component({
            selector: 'ds-input-suggestions',
            styleUrls: ['./input-suggestions.component.scss'],
            templateUrl: './input-suggestions.component.html',
            providers: [
                {
                    provide: NG_VALUE_ACCESSOR,
                    // Usage of forwardRef necessary https://github.com/angular/angular.io/issues/1151
                    // tslint:disable-next-line:no-forward-ref
                    useExisting: forwardRef(function () { return InputSuggestionsComponent_1; }),
                    multi: true
                }
            ]
        })
        /**
         * Component representing a form with a autocomplete functionality
         */
    ], InputSuggestionsComponent);
    return InputSuggestionsComponent;
}());
export { InputSuggestionsComponent };
//# sourceMappingURL=input-suggestions.component.js.map