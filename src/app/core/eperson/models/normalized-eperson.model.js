import * as tslib_1 from "tslib";
import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { EPerson } from './eperson.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';
var NormalizedEPerson = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedEPerson, _super);
    function NormalizedEPerson() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedEPerson.prototype, "handle", void 0);
    tslib_1.__decorate([
        deserialize,
        relationship(ResourceType.Group, true),
        tslib_1.__metadata("design:type", Array)
    ], NormalizedEPerson.prototype, "groups", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedEPerson.prototype, "netid", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedEPerson.prototype, "lastActive", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], NormalizedEPerson.prototype, "canLogIn", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedEPerson.prototype, "email", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], NormalizedEPerson.prototype, "requireCertificate", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], NormalizedEPerson.prototype, "selfRegistered", void 0);
    NormalizedEPerson = tslib_1.__decorate([
        mapsTo(EPerson),
        inheritSerialization(NormalizedDSpaceObject)
    ], NormalizedEPerson);
    return NormalizedEPerson;
}(NormalizedDSpaceObject));
export { NormalizedEPerson };
//# sourceMappingURL=normalized-eperson.model.js.map