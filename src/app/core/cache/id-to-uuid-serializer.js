import { hasValue } from '../../shared/empty.util';
/**
 * Serializer to create unique fake UUID's from id's that might otherwise be the same across multiple object types
 */
var IDToUUIDSerializer = /** @class */ (function () {
    /**
     * @param {string} prefix To prepend the original ID with
     */
    function IDToUUIDSerializer(prefix) {
        this.prefix = prefix;
    }
    /**
     * Method to serialize a UUID
     * @param {string} uuid
     * @returns {any} undefined Fake UUID's should not be sent back to the server, but only be used in the UI
     */
    IDToUUIDSerializer.prototype.Serialize = function (uuid) {
        return undefined;
    };
    /**
     * Method to deserialize a UUID
     * @param {string} id Identifier to transform in to a UUID
     * @returns {string} UUID based on the prefix and the given id
     */
    IDToUUIDSerializer.prototype.Deserialize = function (id) {
        if (hasValue(id)) {
            return this.prefix + "-" + id;
        }
        else {
            return id;
        }
    };
    return IDToUUIDSerializer;
}());
export { IDToUUIDSerializer };
//# sourceMappingURL=id-to-uuid-serializer.js.map