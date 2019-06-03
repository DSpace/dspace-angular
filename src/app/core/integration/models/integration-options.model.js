var IntegrationSearchOptions = /** @class */ (function () {
    function IntegrationSearchOptions(uuid, name, metadata, query, elementsPerPage, currentPage, sort) {
        if (uuid === void 0) { uuid = ''; }
        if (name === void 0) { name = ''; }
        if (metadata === void 0) { metadata = ''; }
        if (query === void 0) { query = ''; }
        this.uuid = uuid;
        this.name = name;
        this.metadata = metadata;
        this.query = query;
        this.elementsPerPage = elementsPerPage;
        this.currentPage = currentPage;
        this.sort = sort;
    }
    return IntegrationSearchOptions;
}());
export { IntegrationSearchOptions };
//# sourceMappingURL=integration-options.model.js.map