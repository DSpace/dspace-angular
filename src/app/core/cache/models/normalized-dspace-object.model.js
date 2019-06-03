import * as tslib_1 from "tslib";
import { autoserializeAs, deserializeAs } from 'cerialize';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { MetadataMap, MetadataMapSerializer } from '../../shared/metadata.models';
import { ResourceType } from '../../shared/resource-type';
import { mapsTo } from '../builders/build-decorators';
import { NormalizedObject } from './normalized-object.model';
/**
 * An model class for a DSpaceObject.
 */
var NormalizedDSpaceObject = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedDSpaceObject, _super);
    function NormalizedDSpaceObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        deserializeAs(String),
        tslib_1.__metadata("design:type", String)
    ], NormalizedDSpaceObject.prototype, "self", void 0);
    tslib_1.__decorate([
        autoserializeAs(String, 'uuid'),
        tslib_1.__metadata("design:type", String)
    ], NormalizedDSpaceObject.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserializeAs(String),
        tslib_1.__metadata("design:type", String)
    ], NormalizedDSpaceObject.prototype, "uuid", void 0);
    tslib_1.__decorate([
        autoserializeAs(String),
        tslib_1.__metadata("design:type", String)
    ], NormalizedDSpaceObject.prototype, "type", void 0);
    tslib_1.__decorate([
        autoserializeAs(MetadataMapSerializer),
        tslib_1.__metadata("design:type", MetadataMap)
    ], NormalizedDSpaceObject.prototype, "metadata", void 0);
    tslib_1.__decorate([
        deserializeAs(String),
        tslib_1.__metadata("design:type", Array)
    ], NormalizedDSpaceObject.prototype, "parents", void 0);
    tslib_1.__decorate([
        deserializeAs(String),
        tslib_1.__metadata("design:type", String)
    ], NormalizedDSpaceObject.prototype, "owner", void 0);
    tslib_1.__decorate([
        deserializeAs(Object),
        tslib_1.__metadata("design:type", Object)
    ], NormalizedDSpaceObject.prototype, "_links", void 0);
    NormalizedDSpaceObject = tslib_1.__decorate([
        mapsTo(DSpaceObject)
    ], NormalizedDSpaceObject);
    return NormalizedDSpaceObject;
}(NormalizedObject));
export { NormalizedDSpaceObject };
//# sourceMappingURL=normalized-dspace-object.model.js.map