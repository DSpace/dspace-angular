import * as tslib_1 from "tslib";
import { DSpaceObject } from './dspace-object.model';
var Community = /** @class */ (function (_super) {
    tslib_1.__extends(Community, _super);
    function Community() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Community.prototype, "introductoryText", {
        /**
         * The introductory text of this Community
         * Corresponds to the metadata field dc.description
         */
        get: function () {
            return this.firstMetadataValue('dc.description');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Community.prototype, "shortDescription", {
        /**
         * The short description: HTML
         * Corresponds to the metadata field dc.description.abstract
         */
        get: function () {
            return this.firstMetadataValue('dc.description.abstract');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Community.prototype, "copyrightText", {
        /**
         * The copyright text of this Community
         * Corresponds to the metadata field dc.rights
         */
        get: function () {
            return this.firstMetadataValue('dc.rights');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Community.prototype, "sidebarText", {
        /**
         * The sidebar text of this Community
         * Corresponds to the metadata field dc.description.tableofcontents
         */
        get: function () {
            return this.firstMetadataValue('dc.description.tableofcontents');
        },
        enumerable: true,
        configurable: true
    });
    return Community;
}(DSpaceObject));
export { Community };
//# sourceMappingURL=community.model.js.map