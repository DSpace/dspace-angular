import { ItemMetadataRepresentation } from '../../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { MetadatumRepresentation } from '../../../../core/shared/metadata-representation/metadatum/metadatum-representation.model';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { getSucceededRemoteData } from '../../../../core/shared/operators';
import { hasValue } from '../../../../shared/empty.util';
import { distinctUntilChanged, flatMap, map } from 'rxjs/operators';
import { of as observableOf, zip as observableZip } from 'rxjs';
/**
 * Operator for comparing arrays using a mapping function
 * The mapping function should turn the source array into an array of basic types, so that the array can
 * be compared using these basic types.
 * For example: "(o) => o.id" will compare the two arrays by comparing their content by id.
 * @param mapFn   Function for mapping the arrays
 */
export var compareArraysUsing = function (mapFn) {
    return function (a, b) {
        if (!Array.isArray(a) || !Array.isArray(b)) {
            return false;
        }
        var aIds = a.map(mapFn);
        var bIds = b.map(mapFn);
        return aIds.length === bIds.length &&
            aIds.every(function (e) { return bIds.includes(e); }) &&
            bIds.every(function (e) { return aIds.includes(e); });
    };
};
/**
 * Operator for comparing arrays using the object's ids
 */
export var compareArraysUsingIds = function () {
    return compareArraysUsing(function (t) { return hasValue(t) ? t.id : undefined; });
};
/**
 * Fetch the relationships which match the type label given
 * @param {string} label      Type label
 * @returns {(source: Observable<[Relationship[] , RelationshipType[]]>) => Observable<Relationship[]>}
 */
export var filterRelationsByTypeLabel = function (label) {
    return function (source) {
        return source.pipe(map(function (_a) {
            var relsCurrentPage = _a[0], relTypesCurrentPage = _a[1];
            return relsCurrentPage.filter(function (rel, idx) {
                return hasValue(relTypesCurrentPage[idx]) && (relTypesCurrentPage[idx].leftLabel === label ||
                    relTypesCurrentPage[idx].rightLabel === label);
            });
        }), distinctUntilChanged(compareArraysUsingIds()));
    };
};
/**
 * Operator for turning a list of relationships into a list of the relevant items
 * @param {string} thisId           The item's id of which the relations belong to
 * @param {ItemDataService} ids     The ItemDataService to fetch items from the REST API
 * @returns {(source: Observable<Relationship[]>) => Observable<Item[]>}
 */
export var relationsToItems = function (thisId, ids) {
    return function (source) {
        return source.pipe(flatMap(function (rels) {
            return observableZip.apply(void 0, rels.map(function (rel) {
                var queryId = rel.leftId;
                if (rel.leftId === thisId) {
                    queryId = rel.rightId;
                }
                return ids.findById(queryId);
            }));
        }), map(function (arr) {
            return arr
                .filter(function (d) { return d.hasSucceeded; })
                .map(function (d) { return d.payload; });
        }), distinctUntilChanged(compareArraysUsingIds()));
    };
};
/**
 * Operator for turning a list of relationships into a list of metadatarepresentations given the original metadata
 * @param parentId    The id of the parent item
 * @param itemType    The type of relation this list resembles (for creating representations)
 * @param metadata    The list of original Metadatum objects
 * @param ids         The ItemDataService to use for fetching Items from the Rest API
 */
export var relationsToRepresentations = function (parentId, itemType, metadata, ids) {
    return function (source) {
        return source.pipe(flatMap(function (rels) {
            return observableZip.apply(void 0, metadata
                .map(function (metadatum) { return Object.assign(new MetadataValue(), metadatum); })
                .map(function (metadatum) {
                if (metadatum.isVirtual) {
                    var matchingRels = rels.filter(function (rel) { return ('' + rel.id) === metadatum.virtualValue; });
                    if (matchingRels.length > 0) {
                        var matchingRel = matchingRels[0];
                        var queryId = matchingRel.leftId;
                        if (matchingRel.leftId === parentId) {
                            queryId = matchingRel.rightId;
                        }
                        return ids.findById(queryId).pipe(getSucceededRemoteData(), map(function (d) { return Object.assign(new ItemMetadataRepresentation(), d.payload); }));
                    }
                }
                else {
                    return observableOf(Object.assign(new MetadatumRepresentation(itemType), metadatum));
                }
            }));
        }));
    };
};
//# sourceMappingURL=item-relationships-utils.js.map