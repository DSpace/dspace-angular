import * as tslib_1 from "tslib";
import { ServerResponseService } from '../shared/services/server-response.service';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
/**
 * This component representing the `PageNotFound` DSpace page.
 */
var PageNotFoundComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {AuthService} authservice
     * @param {ServerResponseService} responseService
     */
    function PageNotFoundComponent(authservice, responseService) {
        this.authservice = authservice;
        this.responseService = responseService;
        this.responseService.setNotFound();
    }
    /**
     * Remove redirect url from the state
     */
    PageNotFoundComponent.prototype.ngOnInit = function () {
        this.authservice.clearRedirectUrl();
    };
    PageNotFoundComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-pagenotfound',
            styleUrls: ['./pagenotfound.component.scss'],
            templateUrl: './pagenotfound.component.html',
            changeDetection: ChangeDetectionStrategy.Default
        }),
        tslib_1.__metadata("design:paramtypes", [AuthService, ServerResponseService])
    ], PageNotFoundComponent);
    return PageNotFoundComponent;
}());
export { PageNotFoundComponent };
//# sourceMappingURL=pagenotfound.component.js.map