import * as tslib_1 from "tslib";
import { Item } from '../../item.model';
import { MetadataRepresentationType } from '../metadata-representation.model';
import { hasValue } from '../../../../shared/empty.util';
/**
 * An object to convert item types into the metadata field it should render for the item's value
 */
export var ItemTypeToValue = {
    Default: 'dc.title',
    Person: 'dc.contributor.author',
    OrgUnit: 'dc.title'
};
/**
 * This class determines which fields to use when rendering an Item as a metadata value.
 */
var ItemMetadataRepresentation = /** @class */ (function (_super) {
    tslib_1.__extends(ItemMetadataRepresentation, _super);
    function ItemMetadataRepresentation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ItemMetadataRepresentation.prototype, "itemType", {
        /**
         * The type of item this item can be represented as
         */
        get: function () {
            return this.firstMetadataValue('relationship.type');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemMetadataRepresentation.prototype, "representationType", {
        /**
         * Fetch the way this item should be rendered as in a list
         */
        get: function () {
            return MetadataRepresentationType.Item;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the value to display, depending on the itemType
     */
    ItemMetadataRepresentation.prototype.getValue = function () {
        var metadata;
        if (hasValue(ItemTypeToValue[this.itemType])) {
            metadata = ItemTypeToValue[this.itemType];
        }
        else {
            metadata = ItemTypeToValue.Default;
        }
        return this.firstMetadataValue(metadata);
    };
    return ItemMetadataRepresentation;
}(Item));
export { ItemMetadataRepresentation };
//# sourceMappingURL=item-metadata-representation.model.js.map