import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';
import { SetViewMode } from '../../../view-mode';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
var CommunitySearchResultGridElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CommunitySearchResultGridElementComponent, _super);
    function CommunitySearchResultGridElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommunitySearchResultGridElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-community-search-result-grid-element',
            styleUrls: ['../search-result-grid-element.component.scss', 'community-search-result-grid-element.component.scss'],
            templateUrl: 'community-search-result-grid-element.component.html'
        }),
        renderElementsFor(CommunitySearchResult, SetViewMode.Grid)
    ], CommunitySearchResultGridElementComponent);
    return CommunitySearchResultGridElementComponent;
}(SearchResultGridElementComponent));
export { CommunitySearchResultGridElementComponent };
//# sourceMappingURL=community-search-result-grid-element.component.js.map