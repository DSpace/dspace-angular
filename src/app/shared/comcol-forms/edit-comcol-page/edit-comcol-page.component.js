import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNotUndefined } from '../../empty.util';
import { first, map } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { DataService } from '../../../core/data/data.service';
/**
 * Component representing the edit page for communities and collections
 */
var EditComColPageComponent = /** @class */ (function () {
    function EditComColPageComponent(dsoDataService, router, route) {
        this.dsoDataService = dsoDataService;
        this.router = router;
        this.route = route;
    }
    EditComColPageComponent.prototype.ngOnInit = function () {
        this.dsoRD$ = this.route.data.pipe(first(), map(function (data) { return data.dso; }));
    };
    /**
     * @param {TDomain} dso The updated version of the DSO
     * Updates an existing DSO based on the submitted user data and navigates to the edited object's home page
     */
    EditComColPageComponent.prototype.onSubmit = function (dso) {
        var _this = this;
        this.dsoDataService.update(dso)
            .pipe(getSucceededRemoteData())
            .subscribe(function (dsoRD) {
            if (isNotUndefined(dsoRD)) {
                var newUUID = dsoRD.payload.uuid;
                _this.router.navigate([_this.frontendURL + newUUID]);
            }
        });
    };
    EditComColPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-edit-comcol',
            template: ''
        }),
        tslib_1.__metadata("design:paramtypes", [DataService,
            Router,
            ActivatedRoute])
    ], EditComColPageComponent);
    return EditComColPageComponent;
}());
export { EditComColPageComponent };
//# sourceMappingURL=edit-comcol-page.component.js.map