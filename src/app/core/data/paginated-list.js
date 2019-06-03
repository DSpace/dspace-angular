import { hasValue } from '../../shared/empty.util';
var PaginatedList = /** @class */ (function () {
    function PaginatedList(pageInfo, page) {
        this.pageInfo = pageInfo;
        this.page = page;
    }
    Object.defineProperty(PaginatedList.prototype, "elementsPerPage", {
        get: function () {
            if (hasValue(this.pageInfo) && hasValue(this.pageInfo.elementsPerPage)) {
                return this.pageInfo.elementsPerPage;
            }
            return this.getPageLength();
        },
        set: function (value) {
            this.pageInfo.elementsPerPage = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginatedList.prototype, "totalElements", {
        get: function () {
            if (hasValue(this.pageInfo) && hasValue(this.pageInfo.totalElements)) {
                return this.pageInfo.totalElements;
            }
            return this.getPageLength();
        },
        set: function (value) {
            this.pageInfo.totalElements = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginatedList.prototype, "totalPages", {
        get: function () {
            if (hasValue(this.pageInfo) && hasValue(this.pageInfo.totalPages)) {
                return this.pageInfo.totalPages;
            }
            return 1;
        },
        set: function (value) {
            this.pageInfo.totalPages = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginatedList.prototype, "currentPage", {
        get: function () {
            if (hasValue(this.pageInfo) && hasValue(this.pageInfo.currentPage)) {
                return this.pageInfo.currentPage;
            }
            return 1;
        },
        set: function (value) {
            this.pageInfo.currentPage = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginatedList.prototype, "first", {
        get: function () {
            return this.pageInfo.first;
        },
        set: function (first) {
            this.pageInfo.first = first;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginatedList.prototype, "prev", {
        get: function () {
            return this.pageInfo.prev;
        },
        set: function (prev) {
            this.pageInfo.prev = prev;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginatedList.prototype, "next", {
        get: function () {
            return this.pageInfo.next;
        },
        set: function (next) {
            this.pageInfo.next = next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginatedList.prototype, "last", {
        get: function () {
            return this.pageInfo.last;
        },
        set: function (last) {
            this.pageInfo.last = last;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginatedList.prototype, "self", {
        get: function () {
            return this.pageInfo.self;
        },
        set: function (self) {
            this.pageInfo.self = self;
        },
        enumerable: true,
        configurable: true
    });
    PaginatedList.prototype.getPageLength = function () {
        return (Array.isArray(this.page)) ? this.page.length : 0;
    };
    return PaginatedList;
}());
export { PaginatedList };
//# sourceMappingURL=paginated-list.js.map