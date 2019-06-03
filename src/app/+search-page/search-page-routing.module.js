import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchPageComponent } from './search-page.component';
import { FilteredSearchPageComponent } from './filtered-search-page.component';
import { FilteredSearchPageGuard } from './filtered-search-page.guard';
var SearchPageRoutingModule = /** @class */ (function () {
    function SearchPageRoutingModule() {
    }
    SearchPageRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forChild([
                    { path: '', component: SearchPageComponent, data: { title: 'search.title' } },
                    { path: ':filter', component: FilteredSearchPageComponent, canActivate: [FilteredSearchPageGuard], data: { title: 'search.' } }
                ])
            ]
        })
    ], SearchPageRoutingModule);
    return SearchPageRoutingModule;
}());
export { SearchPageRoutingModule };
//# sourceMappingURL=search-page-routing.module.js.map