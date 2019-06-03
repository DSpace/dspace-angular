import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { RoleType } from './role-types';
import { CollectionDataService } from '../data/collection-data.service';
/**
 * A service that provides methods to identify user role.
 */
var RoleService = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {CollectionDataService} collectionService
     */
    function RoleService(collectionService) {
        this.collectionService = collectionService;
    }
    /**
     * Check if current user is a submitter
     */
    RoleService.prototype.isSubmitter = function () {
        return this.collectionService.hasAuthorizedCollection().pipe(distinctUntilChanged());
    };
    /**
     * Check if current user is a controller
     */
    RoleService.prototype.isController = function () {
        // TODO find a way to check if user is a controller
        return observableOf(true);
    };
    /**
     * Check if current user is an admin
     */
    RoleService.prototype.isAdmin = function () {
        // TODO find a way to check if user is an admin
        return observableOf(false);
    };
    /**
     * Check if current user by role type
     *
     * @param {RoleType} role
     *    the role type
     */
    RoleService.prototype.checkRole = function (role) {
        var check;
        switch (role) {
            case RoleType.Submitter:
                check = this.isSubmitter();
                break;
            case RoleType.Controller:
                check = this.isController();
                break;
            case RoleType.Admin:
                check = this.isAdmin();
                break;
        }
        return check;
    };
    RoleService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [CollectionDataService])
    ], RoleService);
    return RoleService;
}());
export { RoleService };
//# sourceMappingURL=role.service.js.map