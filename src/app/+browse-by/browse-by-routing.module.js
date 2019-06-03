import * as tslib_1 from "tslib";
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowseByTitlePageComponent } from './+browse-by-title-page/browse-by-title-page.component';
import { BrowseByMetadataPageComponent } from './+browse-by-metadata-page/browse-by-metadata-page.component';
import { BrowseByDatePageComponent } from './+browse-by-date-page/browse-by-date-page.component';
import { BrowseByGuard } from './browse-by-guard';
var BrowseByRoutingModule = /** @class */ (function () {
    function BrowseByRoutingModule() {
    }
    BrowseByRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forChild([
                    { path: 'title', component: BrowseByTitlePageComponent, canActivate: [BrowseByGuard], data: { metadata: 'title', title: 'browse.title' } },
                    { path: 'dateissued', component: BrowseByDatePageComponent, canActivate: [BrowseByGuard], data: { metadata: 'dateissued', metadataField: 'dc.date.issued', title: 'browse.title' } },
                    { path: ':metadata', component: BrowseByMetadataPageComponent, canActivate: [BrowseByGuard], data: { title: 'browse.title' } }
                ])
            ]
        })
    ], BrowseByRoutingModule);
    return BrowseByRoutingModule;
}());
export { BrowseByRoutingModule };
//# sourceMappingURL=browse-by-routing.module.js.map