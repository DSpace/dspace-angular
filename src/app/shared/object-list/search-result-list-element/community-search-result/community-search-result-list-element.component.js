import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { SetViewMode } from '../../../view-mode';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
var CommunitySearchResultListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CommunitySearchResultListElementComponent, _super);
    function CommunitySearchResultListElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommunitySearchResultListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-community-search-result-list-element',
            styleUrls: ['../search-result-list-element.component.scss', 'community-search-result-list-element.component.scss'],
            templateUrl: 'community-search-result-list-element.component.html'
        }),
        renderElementsFor(CommunitySearchResult, SetViewMode.List)
    ], CommunitySearchResultListElementComponent);
    return CommunitySearchResultListElementComponent;
}(SearchResultListElementComponent));
export { CommunitySearchResultListElementComponent };
//# sourceMappingURL=community-search-result-list-element.component.js.map