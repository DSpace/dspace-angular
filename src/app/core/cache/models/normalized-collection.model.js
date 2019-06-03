import * as tslib_1 from "tslib";
import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Collection } from '../../shared/collection.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';
/**
 * Normalized model class for a DSpace Collection
 */
var NormalizedCollection = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedCollection, _super);
    function NormalizedCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedCollection.prototype, "handle", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.License, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedCollection.prototype, "license", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.ResourcePolicy, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedCollection.prototype, "defaultAccessConditions", void 0);
    tslib_1.__decorate([
        deserialize,
        relationship(ResourceType.Bitstream, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedCollection.prototype, "logo", void 0);
    tslib_1.__decorate([
        deserialize,
        relationship(ResourceType.Community, true),
        tslib_1.__metadata("design:type", Array)
    ], NormalizedCollection.prototype, "parents", void 0);
    tslib_1.__decorate([
        deserialize,
        relationship(ResourceType.Community, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedCollection.prototype, "owner", void 0);
    tslib_1.__decorate([
        deserialize,
        relationship(ResourceType.Item, true),
        tslib_1.__metadata("design:type", Array)
    ], NormalizedCollection.prototype, "items", void 0);
    NormalizedCollection = tslib_1.__decorate([
        mapsTo(Collection),
        inheritSerialization(NormalizedDSpaceObject)
    ], NormalizedCollection);
    return NormalizedCollection;
}(NormalizedDSpaceObject));
export { NormalizedCollection };
//# sourceMappingURL=normalized-collection.model.js.map