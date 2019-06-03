import * as tslib_1 from "tslib";
import { DSpaceObject } from './dspace-object.model';
var Collection = /** @class */ (function (_super) {
    tslib_1.__extends(Collection, _super);
    function Collection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Collection.prototype, "introductoryText", {
        /**
         * The introductory text of this Collection
         * Corresponds to the metadata field dc.description
         */
        get: function () {
            return this.firstMetadataValue('dc.description');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "shortDescription", {
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
    Object.defineProperty(Collection.prototype, "copyrightText", {
        /**
         * The copyright text of this Collection
         * Corresponds to the metadata field dc.rights
         */
        get: function () {
            return this.firstMetadataValue('dc.rights');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "dcLicense", {
        /**
         * The license of this Collection
         * Corresponds to the metadata field dc.rights.license
         */
        get: function () {
            return this.firstMetadataValue('dc.rights.license');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "sidebarText", {
        /**
         * The sidebar text of this Collection
         * Corresponds to the metadata field dc.description.tableofcontents
         */
        get: function () {
            return this.firstMetadataValue('dc.description.tableofcontents');
        },
        enumerable: true,
        configurable: true
    });
    return Collection;
}(DSpaceObject));
export { Collection };
//# sourceMappingURL=collection.model.js.map