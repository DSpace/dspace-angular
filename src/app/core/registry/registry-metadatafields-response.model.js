import * as tslib_1 from "tslib";
import { PageInfo } from '../shared/page-info.model';
import { autoserialize, autoserializeAs } from 'cerialize';
import { MetadataField } from '../metadata/metadatafield.model';
var RegistryMetadatafieldsResponse = /** @class */ (function () {
    function RegistryMetadatafieldsResponse() {
    }
    tslib_1.__decorate([
        autoserializeAs(MetadataField),
        tslib_1.__metadata("design:type", Array)
    ], RegistryMetadatafieldsResponse.prototype, "metadatafields", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", PageInfo)
    ], RegistryMetadatafieldsResponse.prototype, "page", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], RegistryMetadatafieldsResponse.prototype, "self", void 0);
    return RegistryMetadatafieldsResponse;
}());
export { RegistryMetadatafieldsResponse };
//# sourceMappingURL=registry-metadatafields-response.model.js.map