import * as tslib_1 from "tslib";
import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Community } from '../../shared/community.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';
/**
 * Normalized model class for a DSpace Community
 */
var NormalizedCommunity = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedCommunity, _super);
    function NormalizedCommunity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedCommunity.prototype, "handle", void 0);
    tslib_1.__decorate([
        deserialize,
        relationship(ResourceType.Bitstream, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedCommunity.prototype, "logo", void 0);
    tslib_1.__decorate([
        deserialize,
        relationship(ResourceType.Community, true),
        tslib_1.__metadata("design:type", Array)
    ], NormalizedCommunity.prototype, "parents", void 0);
    tslib_1.__decorate([
        deserialize,
        relationship(ResourceType.Community, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedCommunity.prototype, "owner", void 0);
    tslib_1.__decorate([
        deserialize,
        relationship(ResourceType.Collection, true),
        tslib_1.__metadata("design:type", Array)
    ], NormalizedCommunity.prototype, "collections", void 0);
    tslib_1.__decorate([
        deserialize,
        relationship(ResourceType.Community, true),
        tslib_1.__metadata("design:type", Array)
    ], NormalizedCommunity.prototype, "subcommunities", void 0);
    NormalizedCommunity = tslib_1.__decorate([
        mapsTo(Community),
        inheritSerialization(NormalizedDSpaceObject)
    ], NormalizedCommunity);
    return NormalizedCommunity;
}(NormalizedDSpaceObject));
export { NormalizedCommunity };
//# sourceMappingURL=normalized-community.model.js.map