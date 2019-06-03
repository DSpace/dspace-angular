var DSpaceRouterStateSerializer = /** @class */ (function () {
    function DSpaceRouterStateSerializer() {
    }
    DSpaceRouterStateSerializer.prototype.serialize = function (routerState) {
        var url = routerState.url;
        var queryParams = routerState.root.queryParams;
        // Only return an object including the URL and query params
        // instead of the entire snapshot
        return { url: url, queryParams: queryParams };
    };
    return DSpaceRouterStateSerializer;
}());
export { DSpaceRouterStateSerializer };
//# sourceMappingURL=dspace-router-state-serializer.js.map