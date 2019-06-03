import * as tslib_1 from "tslib";
import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { Group } from './group.model';
import { ResourceType } from '../../shared/resource-type';
var NormalizedGroup = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedGroup, _super);
    function NormalizedGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        deserialize,
        relationship(ResourceType.Group, true),
        tslib_1.__metadata("design:type", Array)
    ], NormalizedGroup.prototype, "groups", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedGroup.prototype, "handle", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedGroup.prototype, "name", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], NormalizedGroup.prototype, "permanent", void 0);
    NormalizedGroup = tslib_1.__decorate([
        mapsTo(Group),
        inheritSerialization(NormalizedDSpaceObject)
    ], NormalizedGroup);
    return NormalizedGroup;
}(NormalizedDSpaceObject));
export { NormalizedGroup };
//# sourceMappingURL=normalized-group.model.js.map