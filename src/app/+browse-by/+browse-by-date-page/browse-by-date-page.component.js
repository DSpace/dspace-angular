import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { BrowseByMetadataPageComponent, browseParamsToOptions } from '../+browse-by-metadata-page/browse-by-metadata-page.component';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';
import { combineLatest as observableCombineLatest } from 'rxjs/internal/observable/combineLatest';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowseService } from '../../core/browse/browse.service';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { GLOBAL_CONFIG } from '../../../config';
import { StartsWithType } from '../../shared/starts-with/starts-with-decorator';
var BrowseByDatePageComponent = /** @class */ (function (_super) {
    tslib_1.__extends(BrowseByDatePageComponent, _super);
    function BrowseByDatePageComponent(config, route, browseService, dsoService, router, cdRef) {
        var _this = _super.call(this, route, browseService, dsoService, router) || this;
        _this.config = config;
        _this.route = route;
        _this.browseService = browseService;
        _this.dsoService = dsoService;
        _this.router = router;
        _this.cdRef = cdRef;
        /**
         * The default metadata-field to use for determining the lower limit of the StartsWith dropdown options
         */
        _this.defaultMetadataField = 'dc.date.issued';
        return _this;
    }
    BrowseByDatePageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.startsWithType = StartsWithType.date;
        this.updatePage(new BrowseEntrySearchOptions(null, this.paginationConfig, this.sortConfig));
        this.subs.push(observableCombineLatest(this.route.params, this.route.queryParams, this.route.data, function (params, queryParams, data) {
            return Object.assign({}, params, queryParams, data);
        })
            .subscribe(function (params) {
            var metadataField = params.metadataField || _this.defaultMetadataField;
            _this.metadata = params.metadata || _this.defaultMetadata;
            _this.startsWith = +params.startsWith || params.startsWith;
            var searchOptions = browseParamsToOptions(params, Object.assign({}), _this.sortConfig, _this.metadata);
            _this.updatePageWithItems(searchOptions, _this.value);
            _this.updateParent(params.scope);
            _this.updateStartsWithOptions(_this.metadata, metadataField, params.scope);
        }));
    };
    /**
     * Update the StartsWith options
     * In this implementation, it creates a list of years starting from now, going all the way back to the earliest
     * date found on an item within this scope. The further back in time, the bigger the change in years become to avoid
     * extremely long lists with a one-year difference.
     * To determine the change in years, the config found under GlobalConfig.BrowseBy is used for this.
     * @param definition      The metadata definition to fetch the first item for
     * @param metadataField   The metadata field to fetch the earliest date from (expects a date field)
     * @param scope           The scope under which to fetch the earliest item for
     */
    BrowseByDatePageComponent.prototype.updateStartsWithOptions = function (definition, metadataField, scope) {
        var _this = this;
        this.subs.push(this.browseService.getFirstItemFor(definition, scope).subscribe(function (firstItemRD) {
            var lowerLimit = _this.config.browseBy.defaultLowerLimit;
            if (hasValue(firstItemRD.payload)) {
                var date = firstItemRD.payload.firstMetadataValue(metadataField);
                if (hasValue(date) && hasValue(+date.split('-')[0])) {
                    lowerLimit = +date.split('-')[0];
                }
            }
            var options = [];
            var currentYear = new Date().getFullYear();
            var oneYearBreak = Math.floor((currentYear - _this.config.browseBy.oneYearLimit) / 5) * 5;
            var fiveYearBreak = Math.floor((currentYear - _this.config.browseBy.fiveYearLimit) / 10) * 10;
            if (lowerLimit <= fiveYearBreak) {
                lowerLimit -= 10;
            }
            else if (lowerLimit <= oneYearBreak) {
                lowerLimit -= 5;
            }
            else {
                lowerLimit -= 1;
            }
            var i = currentYear;
            while (i > lowerLimit) {
                options.push(i);
                if (i <= fiveYearBreak) {
                    i -= 10;
                }
                else if (i <= oneYearBreak) {
                    i -= 5;
                }
                else {
                    i--;
                }
            }
            if (isNotEmpty(options)) {
                _this.startsWithOptions = options;
                _this.cdRef.detectChanges();
            }
        }));
    };
    BrowseByDatePageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-browse-by-date-page',
            styleUrls: ['../+browse-by-metadata-page/browse-by-metadata-page.component.scss'],
            templateUrl: '../+browse-by-metadata-page/browse-by-metadata-page.component.html'
        })
        /**
         * Component for browsing items by metadata definition of type 'date'
         * A metadata definition is a short term used to describe one or multiple metadata fields.
         * An example would be 'dateissued' for 'dc.date.issued'
         */
        ,
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ActivatedRoute,
            BrowseService,
            DSpaceObjectDataService,
            Router,
            ChangeDetectorRef])
    ], BrowseByDatePageComponent);
    return BrowseByDatePageComponent;
}(BrowseByMetadataPageComponent));
export { BrowseByDatePageComponent };
//# sourceMappingURL=browse-by-date-page.component.js.map