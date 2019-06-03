import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Bitstream } from '../../../core/shared/bitstream.model';
/**
 * This component renders a given Bitstream as a thumbnail.
 * One input parameter of type Bitstream is expected.
 * If no Bitstream is provided, a holderjs image will be rendered instead.
 */
var GridThumbnailComponent = /** @class */ (function () {
    function GridThumbnailComponent() {
        this.data = {};
        /**
         * The default 'holder.js' image
         */
        this.holderSource = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDI2MCAxODAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MTgwL3RleHQ6Tm8gVGh1bWJuYWlsCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTVmNzJmMmFlMGIgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxM3B0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNWY3MmYyYWUwYiI+PHJlY3Qgd2lkdGg9IjI2MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI3Mi4yNDIxODc1IiB5PSI5NiI+Tm8gVGh1bWJuYWlsPC90ZXh0PjwvZz48L2c+PC9zdmc+';
    }
    GridThumbnailComponent.prototype.errorHandler = function (event) {
        event.currentTarget.src = this.holderSource;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Bitstream)
    ], GridThumbnailComponent.prototype, "thumbnail", void 0);
    GridThumbnailComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-grid-thumbnail',
            styleUrls: ['./grid-thumbnail.component.scss'],
            templateUrl: './grid-thumbnail.component.html'
        })
    ], GridThumbnailComponent);
    return GridThumbnailComponent;
}());
export { GridThumbnailComponent };
//# sourceMappingURL=grid-thumbnail.component.js.map