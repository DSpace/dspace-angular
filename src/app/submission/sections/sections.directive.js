import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Directive, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { uniq } from 'lodash';
import { SectionsService } from './sections.service';
import { hasValue, isNotEmpty, isNotNull } from '../../shared/empty.util';
import parseSectionErrorPaths from '../utils/parseSectionErrorPaths';
import { SubmissionService } from '../submission.service';
/**
 * Directive for handling generic section functionality
 */
var SectionsDirective = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {ChangeDetectorRef} changeDetectorRef
     * @param {SubmissionService} submissionService
     * @param {SectionsService} sectionService
     */
    function SectionsDirective(changeDetectorRef, submissionService, sectionService) {
        this.changeDetectorRef = changeDetectorRef;
        this.submissionService = submissionService;
        this.sectionService = sectionService;
        /**
         * A boolean representing if section is mandatory
         * @type {boolean}
         */
        this.mandatory = true;
        /**
         * The list of generic errors related to the section
         * @type {Array}
         */
        this.genericSectionErrors = [];
        /**
         * The list of all errors related to the element belonging to this section
         * @type {Array}
         */
        this.allSectionErrors = [];
        /**
         * A boolean representing if section is active
         * @type {boolean}
         */
        this.active = true;
        /**
         * A boolean representing the panel collapsible state: opened (true) or closed (false)
         * @type {boolean}
         */
        this.sectionState = this.mandatory;
        /**
         * Array to track all subscriptions and unsubscribe them onDestroy
         * @type {Array}
         */
        this.subs = [];
    }
    /**
     * Initialize instance variables
     */
    SectionsDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.valid = this.sectionService.isSectionValid(this.submissionId, this.sectionId).pipe(map(function (valid) {
            if (valid) {
                _this.resetErrors();
            }
            return valid;
        }));
        this.subs.push(this.sectionService.getSectionState(this.submissionId, this.sectionId).pipe(map(function (state) { return state.errors; }))
            .subscribe(function (errors) {
            if (isNotEmpty(errors)) {
                errors.forEach(function (errorItem) {
                    var parsedErrors = parseSectionErrorPaths(errorItem.path);
                    parsedErrors.forEach(function (error) {
                        if (!error.fieldId) {
                            _this.genericSectionErrors = uniq(_this.genericSectionErrors.concat(errorItem.message));
                        }
                        else {
                            _this.allSectionErrors.push(errorItem.message);
                        }
                    });
                });
            }
            else {
                _this.resetErrors();
            }
        }), this.submissionService.getActiveSectionId(this.submissionId)
            .subscribe(function (activeSectionId) {
            var previousActive = _this.active;
            _this.active = (activeSectionId === _this.sectionId);
            if (previousActive !== _this.active) {
                _this.changeDetectorRef.detectChanges();
                // If section is no longer active dispatch save action
                if (!_this.active && isNotNull(activeSectionId)) {
                    _this.submissionService.dispatchSave(_this.submissionId);
                }
            }
        }));
        this.enabled = this.sectionService.isSectionEnabled(this.submissionId, this.sectionId);
    };
    /**
     * Unsubscribe from all subscriptions
     */
    SectionsDirective.prototype.ngOnDestroy = function () {
        this.subs
            .filter(function (subscription) { return hasValue(subscription); })
            .forEach(function (subscription) { return subscription.unsubscribe(); });
    };
    /**
     * Change section state
     *
     * @param event
     *    the event emitted
     */
    SectionsDirective.prototype.sectionChange = function (event) {
        this.sectionState = event.nextState;
    };
    /**
     * Check if section panel is open
     *
     * @returns {boolean}
     *    Returns true when section panel is open
     */
    SectionsDirective.prototype.isOpen = function () {
        return this.sectionState;
    };
    /**
     * Check if section is mandatory
     *
     * @returns {boolean}
     *    Returns true when section is mandatory
     */
    SectionsDirective.prototype.isMandatory = function () {
        return this.mandatory;
    };
    /**
     * Check if section panel is active
     *
     * @returns {boolean}
     *    Returns true when section panel is active
     */
    SectionsDirective.prototype.isSectionActive = function () {
        return this.active;
    };
    /**
     * Check if section is enabled
     *
     * @returns {Observable<boolean>}
     *    Emits true whenever section is enabled
     */
    SectionsDirective.prototype.isEnabled = function () {
        return this.enabled;
    };
    /**
     * Check if section is valid
     *
     * @returns {Observable<boolean>}
     *    Emits true whenever section is valid
     */
    SectionsDirective.prototype.isValid = function () {
        return this.valid;
    };
    /**
     * Remove section panel from submission form
     *
     * @param submissionId
     *    the submission id
     * @param sectionId
     *    the section id
     * @returns {Observable<boolean>}
     *    Emits true whenever section is valid
     */
    SectionsDirective.prototype.removeSection = function (submissionId, sectionId) {
        this.sectionService.removeSection(submissionId, sectionId);
    };
    /**
     * Check if section has only generic errors
     *
     * @returns {boolean}
     *    Returns true when section has only generic errors
     */
    SectionsDirective.prototype.hasGenericErrors = function () {
        return this.genericSectionErrors && this.genericSectionErrors.length > 0;
    };
    /**
     * Check if section has errors
     *
     * @returns {boolean}
     *    Returns true when section has errors
     */
    SectionsDirective.prototype.hasErrors = function () {
        return (this.genericSectionErrors && this.genericSectionErrors.length > 0) ||
            (this.allSectionErrors && this.allSectionErrors.length > 0);
    };
    /**
     * Return section errors
     *
     * @returns {Array}
     *    Returns section errors list
     */
    SectionsDirective.prototype.getErrors = function () {
        return this.genericSectionErrors;
    };
    /**
     * Set form focus to this section panel
     *
     * @param event
     *    The event emitted
     */
    SectionsDirective.prototype.setFocus = function (event) {
        if (!this.active) {
            this.submissionService.setActiveSection(this.submissionId, this.sectionId);
        }
    };
    /**
     * Remove error from list
     *
     * @param index
     *    The error array key
     */
    SectionsDirective.prototype.removeError = function (index) {
        this.genericSectionErrors.splice(index);
    };
    /**
     * Remove all errors from list
     */
    SectionsDirective.prototype.resetErrors = function () {
        if (isNotEmpty(this.genericSectionErrors)) {
            this.sectionService.dispatchRemoveSectionErrors(this.submissionId, this.sectionId);
        }
        this.genericSectionErrors = [];
        this.allSectionErrors = [];
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SectionsDirective.prototype, "mandatory", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SectionsDirective.prototype, "sectionId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SectionsDirective.prototype, "submissionId", void 0);
    SectionsDirective = tslib_1.__decorate([
        Directive({
            selector: '[dsSection]',
            exportAs: 'sectionRef'
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
            SubmissionService,
            SectionsService])
    ], SectionsDirective);
    return SectionsDirective;
}());
export { SectionsDirective };
//# sourceMappingURL=sections.directive.js.map