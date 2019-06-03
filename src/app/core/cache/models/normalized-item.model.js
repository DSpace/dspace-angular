import * as tslib_1 from "tslib";
import { inheritSerialization, deserialize, autoserialize, autoserializeAs } from 'cerialize';
import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Item } from '../../shared/item.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';
/**
 * Normalized model class for a DSpace Item
 */
var NormalizedItem = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedItem, _super);
    function NormalizedItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedItem.prototype, "handle", void 0);
    tslib_1.__decorate([
        deserialize,
        tslib_1.__metadata("design:type", Date)
    ], NormalizedItem.prototype, "lastModified", void 0);
    tslib_1.__decorate([
        autoserializeAs(Boolean, 'inArchive'),
        tslib_1.__metadata("design:type", Boolean)
    ], NormalizedItem.prototype, "isArchived", void 0);
    tslib_1.__decorate([
        autoserializeAs(Boolean, 'discoverable'),
        tslib_1.__metadata("design:type", Boolean)
    ], NormalizedItem.prototype, "isDiscoverable", void 0);
    tslib_1.__decorate([
        autoserializeAs(Boolean, 'withdrawn'),
        tslib_1.__metadata("design:type", Boolean)
    ], NormalizedItem.prototype, "isWithdrawn", void 0);
    tslib_1.__decorate([
        deserialize,
        relationship(ResourceType.Collection, true),
        tslib_1.__metadata("design:type", Array)
    ], NormalizedItem.prototype, "parents", void 0);
    tslib_1.__decorate([
        deserialize,
        relationship(ResourceType.Collection, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedItem.prototype, "owningCollection", void 0);
    tslib_1.__decorate([
        deserialize,
        relationship(ResourceType.Bitstream, true),
        tslib_1.__metadata("design:type", Array)
    ], NormalizedItem.prototype, "bitstreams", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.Relationship, true),
        tslib_1.__metadata("design:type", Array)
    ], NormalizedItem.prototype, "relationships", void 0);
    NormalizedItem = tslib_1.__decorate([
        mapsTo(Item),
        inheritSerialization(NormalizedDSpaceObject)
    ], NormalizedItem);
    return NormalizedItem;
}(NormalizedDSpaceObject));
export { NormalizedItem };
//# sourceMappingURL=normalized-item.model.js.map