import * as tslib_1 from "tslib";
import { map, startWith, filter, take } from 'rxjs/operators';
import { DSpaceObject } from './dspace-object.model';
import { hasValue, isNotEmpty, isNotUndefined } from '../../shared/empty.util';
var Item = /** @class */ (function (_super) {
    tslib_1.__extends(Item, _super);
    function Item() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Item.prototype, "owner", {
        get: function () {
            return this.owningCollection;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Retrieves the thumbnail of this item
     * @returns {Observable<Bitstream>} the primaryBitstream of the 'THUMBNAIL' bundle
     */
    Item.prototype.getThumbnail = function () {
        // TODO: currently this just picks the first thumbnail
        // should be adjusted when we have a way to determine
        // the primary thumbnail from rest
        return this.getBitstreamsByBundleName('THUMBNAIL').pipe(filter(function (thumbnails) { return isNotEmpty(thumbnails); }), map(function (thumbnails) { return thumbnails[0]; }));
    };
    /**
     * Retrieves the thumbnail for the given original of this item
     * @returns {Observable<Bitstream>} the primaryBitstream of the 'THUMBNAIL' bundle
     */
    Item.prototype.getThumbnailForOriginal = function (original) {
        return this.getBitstreamsByBundleName('THUMBNAIL').pipe(map(function (files) {
            return files.find(function (thumbnail) { return thumbnail.name.startsWith(original.name); });
        }), startWith(undefined));
    };
    /**
     * Retrieves all files that should be displayed on the item page of this item
     * @returns {Observable<Array<Observable<Bitstream>>>} an array of all Bitstreams in the 'ORIGINAL' bundle
     */
    Item.prototype.getFiles = function () {
        return this.getBitstreamsByBundleName('ORIGINAL');
    };
    /**
     * Retrieves bitstreams by bundle name
     * @param bundleName The name of the Bundle that should be returned
     * @returns {Observable<Bitstream[]>} the bitstreams with the given bundleName
     * TODO now that bitstreams can be paginated this should move to the server
     * see https://github.com/DSpace/dspace-angular/issues/332
     */
    Item.prototype.getBitstreamsByBundleName = function (bundleName) {
        return this.bitstreams.pipe(filter(function (rd) { return !rd.isResponsePending && isNotUndefined(rd.payload); }), map(function (rd) { return rd.payload.page; }), filter(function (bitstreams) { return hasValue(bitstreams); }), take(1), startWith([]), map(function (bitstreams) {
            return bitstreams
                .filter(function (bitstream) { return hasValue(bitstream); })
                .filter(function (bitstream) { return bitstream.bundleName === bundleName; });
        }));
    };
    return Item;
}(DSpaceObject));
export { Item };
//# sourceMappingURL=item.model.js.map