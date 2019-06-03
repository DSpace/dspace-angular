import 'reflect-metadata';
var mapsToMetadataKey = Symbol('mapsTo');
var relationshipKey = Symbol('relationship');
var relationshipMap = new Map();
export function mapsTo(value) {
    return Reflect.metadata(mapsToMetadataKey, value);
}
export function getMapsTo(target) {
    return Reflect.getOwnMetadata(mapsToMetadataKey, target);
}
export function relationship(value, isList) {
    if (isList === void 0) { isList = false; }
    return function r(target, propertyKey, descriptor) {
        if (!target || !propertyKey) {
            return;
        }
        var metaDataList = relationshipMap.get(target.constructor) || [];
        if (metaDataList.indexOf(propertyKey) === -1) {
            metaDataList.push(propertyKey);
        }
        relationshipMap.set(target.constructor, metaDataList);
        return Reflect.metadata(relationshipKey, { resourceType: value, isList: isList }).apply(this, arguments);
    };
}
export function getRelationMetadata(target, propertyKey) {
    return Reflect.getMetadata(relationshipKey, target, propertyKey);
}
export function getRelationships(target) {
    return relationshipMap.get(target);
}
//# sourceMappingURL=build-decorators.js.map