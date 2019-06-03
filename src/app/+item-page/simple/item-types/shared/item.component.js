import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { combineLatest as observableCombineLatest, zip as observableZip } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map } from 'rxjs/operators';
import { Item } from '../../../../core/shared/item.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../core/shared/operators';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { compareArraysUsingIds, relationsToRepresentations } from './item-relationships-utils';
var ItemComponent = /** @class */ (function () {
    function ItemComponent(item) {
        this.item = item;
    }
    ItemComponent.prototype.ngOnInit = function () {
        var relationships$ = this.item.relationships;
        if (relationships$) {
            var relsCurrentPage$ = relationships$.pipe(filter(function (rd) { return rd.hasSucceeded; }), getRemoteDataPayload(), map(function (pl) { return pl.page; }), distinctUntilChanged(compareArraysUsingIds()));
            var relTypesCurrentPage$ = relsCurrentPage$.pipe(flatMap(function (rels) {
                return observableZip.apply(void 0, rels.map(function (rel) { return rel.relationshipType; })).pipe(map(function (_a) {
                    var arr = _a.slice(0);
                    return arr.map(function (d) { return d.payload; });
                }));
            }), distinctUntilChanged(compareArraysUsingIds()));
            this.resolvedRelsAndTypes$ = observableCombineLatest(relsCurrentPage$, relTypesCurrentPage$);
        }
    };
    /**
     * Build a list of MetadataRepresentations for the current item. This combines all metadata and relationships of a
     * certain type.
     * @param itemType          The type of item we're building representations of. Used for matching templates.
     * @param metadataField     The metadata field that resembles the item type.
     * @param itemDataService   ItemDataService to turn relations into items.
     */
    ItemComponent.prototype.buildRepresentations = function (itemType, metadataField, itemDataService) {
        var metadata = this.item.findMetadataSortedByPlace(metadataField);
        var relsCurrentPage$ = this.item.relationships.pipe(getSucceededRemoteData(), getRemoteDataPayload(), map(function (pl) { return pl.page; }), distinctUntilChanged(compareArraysUsingIds()));
        return relsCurrentPage$.pipe(relationsToRepresentations(this.item.id, itemType, metadata, itemDataService));
    };
    ItemComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item',
            template: ''
        })
        /**
         * A generic component for displaying metadata and relations of an item
         */
        ,
        tslib_1.__param(0, Inject(ITEM)),
        tslib_1.__metadata("design:paramtypes", [Item])
    ], ItemComponent);
    return ItemComponent;
}());
export { ItemComponent };
//# sourceMappingURL=item.component.js.map