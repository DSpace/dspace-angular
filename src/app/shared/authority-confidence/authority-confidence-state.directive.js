import * as tslib_1 from "tslib";
import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, Output, Renderer2 } from '@angular/core';
import { findIndex } from 'lodash';
import { AuthorityValue } from '../../core/integration/models/authority.value';
import { FormFieldMetadataValueObject } from '../form/builder/models/form-field-metadata-value.model';
import { ConfidenceType } from '../../core/integration/models/confidence-type';
import { isNotEmpty, isNull } from '../empty.util';
import { GLOBAL_CONFIG } from '../../../config';
/**
 * Directive to add to the element a bootstrap utility class based on metadata confidence value
 */
var AuthorityConfidenceStateDirective = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {GlobalConfig} EnvConfig
     * @param {ElementRef} elem
     * @param {Renderer2} renderer
     */
    function AuthorityConfidenceStateDirective(EnvConfig, elem, renderer) {
        this.EnvConfig = EnvConfig;
        this.elem = elem;
        this.renderer = renderer;
        /**
         * A boolean representing if to show html icon if authority value is empty
         */
        this.visibleWhenAuthorityEmpty = true;
        /**
         * The css class applied before directive changes
         */
        this.previousClass = null;
        /**
         * An event fired when click on element that has a confidence value empty or different from CF_ACCEPTED
         */
        this.whenClickOnConfidenceNotAccepted = new EventEmitter();
    }
    /**
     * Listener to click event
     */
    AuthorityConfidenceStateDirective.prototype.onClick = function () {
        if (isNotEmpty(this.authorityValue) && this.getConfidenceByValue(this.authorityValue) !== ConfidenceType.CF_ACCEPTED) {
            this.whenClickOnConfidenceNotAccepted.emit(this.getConfidenceByValue(this.authorityValue));
        }
    };
    /**
     * Apply css class to element whenever authority value change
     *
     * @param {SimpleChanges} changes
     */
    AuthorityConfidenceStateDirective.prototype.ngOnChanges = function (changes) {
        if (!changes.authorityValue.firstChange) {
            this.previousClass = this.getClassByConfidence(this.getConfidenceByValue(changes.authorityValue.previousValue));
        }
        this.newClass = this.getClassByConfidence(this.getConfidenceByValue(changes.authorityValue.currentValue));
        if (isNull(this.previousClass)) {
            this.renderer.addClass(this.elem.nativeElement, this.newClass);
        }
        else if (this.previousClass !== this.newClass) {
            this.renderer.removeClass(this.elem.nativeElement, this.previousClass);
            this.renderer.addClass(this.elem.nativeElement, this.newClass);
        }
    };
    /**
     * Apply css class to element after view init
     */
    AuthorityConfidenceStateDirective.prototype.ngAfterViewInit = function () {
        if (isNull(this.previousClass)) {
            this.renderer.addClass(this.elem.nativeElement, this.newClass);
        }
        else if (this.previousClass !== this.newClass) {
            this.renderer.removeClass(this.elem.nativeElement, this.previousClass);
            this.renderer.addClass(this.elem.nativeElement, this.newClass);
        }
    };
    /**
     * Return confidence value as ConfidenceType
     *
     * @param value
     */
    AuthorityConfidenceStateDirective.prototype.getConfidenceByValue = function (value) {
        var confidence = ConfidenceType.CF_UNSET;
        if (isNotEmpty(value) && value instanceof AuthorityValue && value.hasAuthority()) {
            confidence = ConfidenceType.CF_ACCEPTED;
        }
        if (isNotEmpty(value) && value instanceof FormFieldMetadataValueObject) {
            confidence = value.confidence;
        }
        return confidence;
    };
    /**
     * Return the properly css class based on confidence value
     *
     * @param confidence
     */
    AuthorityConfidenceStateDirective.prototype.getClassByConfidence = function (confidence) {
        if (!this.visibleWhenAuthorityEmpty && confidence === ConfidenceType.CF_UNSET) {
            return 'd-none';
        }
        var confidenceIcons = this.EnvConfig.submission.icons.authority.confidence;
        var confidenceIndex = findIndex(confidenceIcons, { value: confidence });
        var defaultconfidenceIndex = findIndex(confidenceIcons, { value: 'default' });
        var defaultClass = (defaultconfidenceIndex !== -1) ? confidenceIcons[defaultconfidenceIndex].style : '';
        return (confidenceIndex !== -1) ? confidenceIcons[confidenceIndex].style : defaultClass;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], AuthorityConfidenceStateDirective.prototype, "authorityValue", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], AuthorityConfidenceStateDirective.prototype, "visibleWhenAuthorityEmpty", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AuthorityConfidenceStateDirective.prototype, "whenClickOnConfidenceNotAccepted", void 0);
    tslib_1.__decorate([
        HostListener('click'),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], AuthorityConfidenceStateDirective.prototype, "onClick", null);
    AuthorityConfidenceStateDirective = tslib_1.__decorate([
        Directive({
            selector: '[dsAuthorityConfidenceState]'
        }),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ElementRef,
            Renderer2])
    ], AuthorityConfidenceStateDirective);
    return AuthorityConfidenceStateDirective;
}());
export { AuthorityConfidenceStateDirective };
//# sourceMappingURL=authority-confidence-state.directive.js.map