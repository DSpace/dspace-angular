/**
 * A class that defines the search options to be used for fetching browse entries or items
 * - metadataDefinition:  The metadata definition to fetch entries or items for
 * - pagination:          Optional pagination options to use
 * - sort:                Optional sorting options to use
 * - scope:               An optional scope to limit the results within a specific collection or community
 */
var BrowseEntrySearchOptions = /** @class */ (function () {
    function BrowseEntrySearchOptions(metadataDefinition, pagination, sort, startsWith, scope) {
        this.metadataDefinition = metadataDefinition;
        this.pagination = pagination;
        this.sort = sort;
        this.startsWith = startsWith;
        this.scope = scope;
    }
    return BrowseEntrySearchOptions;
}());
export { BrowseEntrySearchOptions };
//# sourceMappingURL=browse-entry-search-options.model.js.map