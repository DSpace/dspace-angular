import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { CommunityDataService } from '../../../core/data/community-data.service';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { isNotEmpty, isNotUndefined } from '../../empty.util';
import { take } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { DataService } from '../../../core/data/data.service';
/**
 * Component representing the create page for communities and collections
 */
var CreateComColPageComponent = /** @class */ (function () {
    function CreateComColPageComponent(dsoDataService, parentDataService, routeService, router) {
        this.dsoDataService = dsoDataService;
        this.parentDataService = parentDataService;
        this.routeService = routeService;
        this.router = router;
    }
    CreateComColPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.parentUUID$ = this.routeService.getQueryParameterValue('parent');
        this.parentUUID$.pipe(take(1)).subscribe(function (parentID) {
            if (isNotEmpty(parentID)) {
                _this.parentRD$ = _this.parentDataService.findById(parentID);
            }
        });
    };
    /**
     * @param {TDomain} dso The updated version of the DSO
     * Creates a new DSO based on the submitted user data and navigates to the new object's home page
     */
    CreateComColPageComponent.prototype.onSubmit = function (dso) {
        var _this = this;
        this.parentUUID$.pipe(take(1)).subscribe(function (uuid) {
            _this.dsoDataService.create(dso, uuid)
                .pipe(getSucceededRemoteData())
                .subscribe(function (dsoRD) {
                if (isNotUndefined(dsoRD)) {
                    var newUUID = dsoRD.payload.uuid;
                    _this.router.navigate([_this.frontendURL + newUUID]);
                }
            });
        });
    };
    CreateComColPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-create-comcol',
            template: ''
        }),
        tslib_1.__metadata("design:paramtypes", [DataService,
            CommunityDataService,
            RouteService,
            Router])
    ], CreateComColPageComponent);
    return CreateComColPageComponent;
}());
export { CreateComColPageComponent };
//# sourceMappingURL=create-comcol-page.component.js.map