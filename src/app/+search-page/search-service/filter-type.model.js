/**
 * Enumeration containing all possible types for filters
 */
export var FilterType;
(function (FilterType) {
    /**
     * Represents authority facets
     */
    FilterType["authority"] = "authority";
    /**
     * Represents simple text facets
     */
    FilterType["text"] = "text";
    /**
     * Represents date facets
     */
    FilterType["range"] = "date";
    /**
     * Represents hierarchically structured facets
     */
    FilterType["hierarchy"] = "hierarchical";
    /**
     * Represents binary facets
     */
    FilterType["boolean"] = "standard";
})(FilterType || (FilterType = {}));
//# sourceMappingURL=filter-type.model.js.map