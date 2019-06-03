import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { combineLatest } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { hasValue } from '../empty.util';
import { RoleService } from '../../core/roles/role.service';
var RoleDirective = /** @class */ (function () {
    function RoleDirective(roleService, viewContainer, changeDetector, templateRef) {
        this.roleService = roleService;
        this.viewContainer = viewContainer;
        this.changeDetector = changeDetector;
        this.templateRef = templateRef;
        this.subs = [];
    }
    RoleDirective.prototype.ngOnChanges = function (changes) {
        var onlyChanges = changes.dsShowOnlyForRole;
        var exceptChanges = changes.dsShowExceptForRole;
        this.hasRoles(this.dsShowOnlyForRole);
        if (changes.dsShowOnlyForRole) {
            this.validateOnly();
        }
        else if (changes.dsShowExceptForRole) {
            this.validateExcept();
        }
    };
    RoleDirective.prototype.ngOnDestroy = function () {
        this.subs
            .filter(function (subscription) { return hasValue(subscription); })
            .forEach(function (subscription) { return subscription.unsubscribe(); });
    };
    /**
     * Show template in view container
     */
    RoleDirective.prototype.showTemplateBlockInView = function () {
        this.viewContainer.clear();
        if (!this.templateRef) {
            return;
        }
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.changeDetector.markForCheck();
    };
    /**
     * Validate the list of roles that can show template
     */
    RoleDirective.prototype.validateOnly = function () {
        var _this = this;
        this.subs.push(this.hasRoles(this.dsShowOnlyForRole).pipe(filter(function (hasRole) { return hasRole; }))
            .subscribe(function (hasRole) {
            _this.showTemplateBlockInView();
        }));
    };
    /**
     * Validate the list of roles that cannot show template
     */
    RoleDirective.prototype.validateExcept = function () {
        var _this = this;
        this.subs.push(this.hasRoles(this.dsShowExceptForRole).pipe(filter(function (hasRole) { return !hasRole; }))
            .subscribe(function (hasRole) {
            _this.showTemplateBlockInView();
        }));
    };
    /**
     * Check if current user role is included in the specified role list
     *
     * @param roles
     *    The role or the list of roles
     * @returns {Observable<boolean>}
     *    observable of true if current user role is included in the specified role list, observable of false otherwise
     */
    RoleDirective.prototype.hasRoles = function (roles) {
        var _this = this;
        var toValidate = (Array.isArray(roles)) ? roles : [roles];
        var checks = toValidate.map(function (role) { return _this.roleService.checkRole(role); });
        return combineLatest(checks).pipe(map(function (permissions) { return permissions.includes(true); }), first());
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], RoleDirective.prototype, "dsShowOnlyForRole", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], RoleDirective.prototype, "dsShowExceptForRole", void 0);
    RoleDirective = tslib_1.__decorate([
        Directive({
            selector: '[dsShowOnlyForRole],[dsShowExceptForRole]'
        })
        /**
         * Structural Directive for showing or hiding a template based on current user role
         */
        ,
        tslib_1.__metadata("design:paramtypes", [RoleService,
            ViewContainerRef,
            ChangeDetectorRef,
            TemplateRef])
    ], RoleDirective);
    return RoleDirective;
}());
export { RoleDirective };
//# sourceMappingURL=role.directive.js.map