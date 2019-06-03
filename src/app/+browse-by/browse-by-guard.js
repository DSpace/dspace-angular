import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { DSpaceObjectDataService } from '../core/data/dspace-object-data.service';
import { hasValue } from '../shared/empty.util';
import { map } from 'rxjs/operators';
import { getSucceededRemoteData } from '../core/shared/operators';
import { TranslateService } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
var BrowseByGuard = /** @class */ (function () {
    function BrowseByGuard(dsoService, translate) {
        this.dsoService = dsoService;
        this.translate = translate;
    }
    BrowseByGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        var title = route.data.title;
        var metadata = route.params.metadata || route.queryParams.metadata || route.data.metadata;
        var metadataField = route.data.metadataField;
        var scope = route.queryParams.scope;
        var value = route.queryParams.value;
        var metadataTranslated = this.translate.instant('browse.metadata.' + metadata);
        if (hasValue(scope)) {
            var dsoAndMetadata$ = this.dsoService.findById(scope).pipe(getSucceededRemoteData());
            return dsoAndMetadata$.pipe(map(function (dsoRD) {
                var name = dsoRD.payload.name;
                route.data = _this.createData(title, metadata, metadataField, name, metadataTranslated, value);
                return true;
            }));
        }
        else {
            route.data = this.createData(title, metadata, metadataField, '', metadataTranslated, value);
            return observableOf(true);
        }
    };
    BrowseByGuard.prototype.createData = function (title, metadata, metadataField, collection, field, value) {
        return {
            title: title,
            metadata: metadata,
            metadataField: metadataField,
            collection: collection,
            field: field,
            value: hasValue(value) ? "\"" + value + "\"" : ''
        };
    };
    BrowseByGuard = tslib_1.__decorate([
        Injectable()
        /**
         * A guard taking care of the correct route.data being set for the Browse-By components
         */
        ,
        tslib_1.__metadata("design:paramtypes", [DSpaceObjectDataService,
            TranslateService])
    ], BrowseByGuard);
    return BrowseByGuard;
}());
export { BrowseByGuard };
//# sourceMappingURL=browse-by-guard.js.map