var startsWithMap = new Map();
/**
 * An enum that defines the type of StartsWith options
 */
export var StartsWithType;
(function (StartsWithType) {
    StartsWithType["text"] = "Text";
    StartsWithType["date"] = "Date";
})(StartsWithType || (StartsWithType = {}));
/**
 * Fetch a decorator to render a StartsWith component for type
 * @param type
 */
export function renderStartsWithFor(type) {
    return function decorator(objectElement) {
        if (!objectElement) {
            return;
        }
        startsWithMap.set(type, objectElement);
    };
}
/**
 * Get the correct component depending on the StartsWith type
 * @param type
 */
export function getStartsWithComponent(type) {
    return startsWithMap.get(type);
}
//# sourceMappingURL=starts-with-decorator.js.map