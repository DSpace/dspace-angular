import * as tslib_1 from "tslib";
import { MetadataRegistryComponent } from './metadata-registry/metadata-registry.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MetadataSchemaComponent } from './metadata-schema/metadata-schema.component';
import { BitstreamFormatsComponent } from './bitstream-formats/bitstream-formats.component';
var AdminRegistriesRoutingModule = /** @class */ (function () {
    function AdminRegistriesRoutingModule() {
    }
    AdminRegistriesRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forChild([
                    { path: 'metadata', component: MetadataRegistryComponent, data: { title: 'admin.registries.metadata.title' } },
                    { path: 'metadata/:schemaName', component: MetadataSchemaComponent, data: { title: 'admin.registries.schema.title' } },
                    { path: 'bitstream-formats', component: BitstreamFormatsComponent, data: { title: 'admin.registries.bitstream-formats.title' } },
                ])
            ]
        })
    ], AdminRegistriesRoutingModule);
    return AdminRegistriesRoutingModule;
}());
export { AdminRegistriesRoutingModule };
//# sourceMappingURL=admin-registries-routing.module.js.map