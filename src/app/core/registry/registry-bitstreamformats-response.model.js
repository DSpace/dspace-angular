import * as tslib_1 from "tslib";
import { autoserialize, autoserializeAs } from 'cerialize';
import { PageInfo } from '../shared/page-info.model';
import { BitstreamFormat } from '../shared/bitstream-format.model';
var RegistryBitstreamformatsResponse = /** @class */ (function () {
    function RegistryBitstreamformatsResponse() {
    }
    tslib_1.__decorate([
        autoserializeAs(BitstreamFormat),
        tslib_1.__metadata("design:type", Array)
    ], RegistryBitstreamformatsResponse.prototype, "bitstreamformats", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", PageInfo)
    ], RegistryBitstreamformatsResponse.prototype, "page", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], RegistryBitstreamformatsResponse.prototype, "self", void 0);
    return RegistryBitstreamformatsResponse;
}());
export { RegistryBitstreamformatsResponse };
//# sourceMappingURL=registry-bitstreamformats-response.model.js.map