import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ItemViewMode, rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
var JournalIssueListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(JournalIssueListElementComponent, _super);
    /**
     * The component for displaying a list element for an item of the type Journal Issue
     */
    function JournalIssueListElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JournalIssueListElementComponent = tslib_1.__decorate([
        rendersItemType('JournalIssue', ItemViewMode.Element),
        Component({
            selector: 'ds-journal-issue-list-element',
            styleUrls: ['./journal-issue-list-element.component.scss'],
            templateUrl: './journal-issue-list-element.component.html'
        })
        /**
         * The component for displaying a list element for an item of the type Journal Issue
         */
    ], JournalIssueListElementComponent);
    return JournalIssueListElementComponent;
}(TypedItemSearchResultListElementComponent));
export { JournalIssueListElementComponent };
//# sourceMappingURL=journal-issue-list-element.component.js.map