import * as tslib_1 from "tslib";
import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { ItemType } from '../../../shared/item-relationships/item-type.model';
import { ResourceType } from '../../../shared/resource-type';
import { mapsTo } from '../../builders/build-decorators';
import { NormalizedObject } from '../normalized-object.model';
import { IDToUUIDSerializer } from '../../id-to-uuid-serializer';
/**
 * Normalized model class for a DSpace ItemType
 */
var NormalizedItemType = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedItemType, _super);
    function NormalizedItemType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedItemType.prototype, "label", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedItemType.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserializeAs(new IDToUUIDSerializer(ResourceType.ItemType), 'id'),
        tslib_1.__metadata("design:type", String)
    ], NormalizedItemType.prototype, "uuid", void 0);
    NormalizedItemType = tslib_1.__decorate([
        mapsTo(ItemType),
        inheritSerialization(NormalizedObject)
    ], NormalizedItemType);
    return NormalizedItemType;
}(NormalizedObject));
export { NormalizedItemType };
//# sourceMappingURL=normalized-item-type.model.js.map