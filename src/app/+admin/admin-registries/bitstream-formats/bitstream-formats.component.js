import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
/**
 * This component renders a list of bitstream formats
 */
var BitstreamFormatsComponent = /** @class */ (function () {
    function BitstreamFormatsComponent(registryService) {
        this.registryService = registryService;
        /**
         * The current pagination configuration for the page
         * Currently simply renders all bitstream formats
         */
        this.config = Object.assign(new PaginationComponentOptions(), {
            id: 'registry-bitstreamformats-pagination',
            pageSize: 10000
        });
        this.updateFormats();
    }
    /**
     * When the page is changed, make sure to update the list of bitstreams to match the new page
     * @param event The page change event
     */
    BitstreamFormatsComponent.prototype.onPageChange = function (event) {
        this.config.currentPage = event;
        this.updateFormats();
    };
    /**
     * Method to update the bitstream formats that are shown
     */
    BitstreamFormatsComponent.prototype.updateFormats = function () {
        this.bitstreamFormats = this.registryService.getBitstreamFormats(this.config);
    };
    BitstreamFormatsComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-bitstream-formats',
            templateUrl: './bitstream-formats.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [RegistryService])
    ], BitstreamFormatsComponent);
    return BitstreamFormatsComponent;
}());
export { BitstreamFormatsComponent };
//# sourceMappingURL=bitstream-formats.component.js.map