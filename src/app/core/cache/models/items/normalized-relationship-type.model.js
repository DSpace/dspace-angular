import * as tslib_1 from "tslib";
import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { RelationshipType } from '../../../shared/item-relationships/relationship-type.model';
import { ResourceType } from '../../../shared/resource-type';
import { mapsTo, relationship } from '../../builders/build-decorators';
import { NormalizedDSpaceObject } from '../normalized-dspace-object.model';
import { NormalizedObject } from '../normalized-object.model';
import { IDToUUIDSerializer } from '../../id-to-uuid-serializer';
/**
 * Normalized model class for a DSpace RelationshipType
 */
var NormalizedRelationshipType = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedRelationshipType, _super);
    function NormalizedRelationshipType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedRelationshipType.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedRelationshipType.prototype, "leftLabel", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], NormalizedRelationshipType.prototype, "leftMaxCardinality", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], NormalizedRelationshipType.prototype, "leftMinCardinality", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedRelationshipType.prototype, "rightLabel", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], NormalizedRelationshipType.prototype, "rightMaxCardinality", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], NormalizedRelationshipType.prototype, "rightMinCardinality", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.ItemType, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedRelationshipType.prototype, "leftType", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.ItemType, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedRelationshipType.prototype, "rightType", void 0);
    tslib_1.__decorate([
        autoserializeAs(new IDToUUIDSerializer(ResourceType.RelationshipType), 'id'),
        tslib_1.__metadata("design:type", String)
    ], NormalizedRelationshipType.prototype, "uuid", void 0);
    NormalizedRelationshipType = tslib_1.__decorate([
        mapsTo(RelationshipType),
        inheritSerialization(NormalizedDSpaceObject)
    ], NormalizedRelationshipType);
    return NormalizedRelationshipType;
}(NormalizedObject));
export { NormalizedRelationshipType };
//# sourceMappingURL=normalized-relationship-type.model.js.map