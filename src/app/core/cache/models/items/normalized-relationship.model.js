import * as tslib_1 from "tslib";
import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { Relationship } from '../../../shared/item-relationships/relationship.model';
import { ResourceType } from '../../../shared/resource-type';
import { mapsTo, relationship } from '../../builders/build-decorators';
import { NormalizedObject } from '../normalized-object.model';
import { IDToUUIDSerializer } from '../../id-to-uuid-serializer';
/**
 * Normalized model class for a DSpace Relationship
 */
var NormalizedRelationship = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedRelationship, _super);
    function NormalizedRelationship() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedRelationship.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedRelationship.prototype, "leftId", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedRelationship.prototype, "rightId", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], NormalizedRelationship.prototype, "leftPlace", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], NormalizedRelationship.prototype, "rightPlace", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.RelationshipType, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedRelationship.prototype, "relationshipType", void 0);
    tslib_1.__decorate([
        autoserializeAs(new IDToUUIDSerializer(ResourceType.Relationship), 'id'),
        tslib_1.__metadata("design:type", String)
    ], NormalizedRelationship.prototype, "uuid", void 0);
    NormalizedRelationship = tslib_1.__decorate([
        mapsTo(Relationship),
        inheritSerialization(NormalizedObject)
    ], NormalizedRelationship);
    return NormalizedRelationship;
}(NormalizedObject));
export { NormalizedRelationship };
//# sourceMappingURL=normalized-relationship.model.js.map