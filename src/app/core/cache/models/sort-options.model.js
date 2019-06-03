export var SortDirection;
(function (SortDirection) {
    SortDirection["ASC"] = "ASC";
    SortDirection["DESC"] = "DESC";
})(SortDirection || (SortDirection = {}));
var SortOptions = /** @class */ (function () {
    function SortOptions(field, direction) {
        this.field = field;
        this.direction = direction;
    }
    return SortOptions;
}());
export { SortOptions };
//# sourceMappingURL=sort-options.model.js.map