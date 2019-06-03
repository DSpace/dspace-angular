import * as tslib_1 from "tslib";
import { MetadataSchema } from '../metadata/metadataschema.model';
import { PageInfo } from '../shared/page-info.model';
import { autoserialize, autoserializeAs } from 'cerialize';
var RegistryMetadataschemasResponse = /** @class */ (function () {
    function RegistryMetadataschemasResponse() {
    }
    tslib_1.__decorate([
        autoserializeAs(MetadataSchema),
        tslib_1.__metadata("design:type", Array)
    ], RegistryMetadataschemasResponse.prototype, "metadataschemas", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", PageInfo)
    ], RegistryMetadataschemasResponse.prototype, "page", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], RegistryMetadataschemasResponse.prototype, "self", void 0);
    return RegistryMetadataschemasResponse;
}());
export { RegistryMetadataschemasResponse };
//# sourceMappingURL=registry-metadataschemas-response.model.js.map