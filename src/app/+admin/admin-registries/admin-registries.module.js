import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { MetadataRegistryComponent } from './metadata-registry/metadata-registry.component';
import { AdminRegistriesRoutingModule } from './admin-registries-routing.module';
import { CommonModule } from '@angular/common';
import { MetadataSchemaComponent } from './metadata-schema/metadata-schema.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BitstreamFormatsComponent } from './bitstream-formats/bitstream-formats.component';
import { SharedModule } from '../../shared/shared.module';
import { MetadataSchemaFormComponent } from './metadata-registry/metadata-schema-form/metadata-schema-form.component';
import { MetadataFieldFormComponent } from './metadata-schema/metadata-field-form/metadata-field-form.component';
var AdminRegistriesModule = /** @class */ (function () {
    function AdminRegistriesModule() {
    }
    AdminRegistriesModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                SharedModule,
                RouterModule,
                TranslateModule,
                AdminRegistriesRoutingModule
            ],
            declarations: [
                MetadataRegistryComponent,
                MetadataSchemaComponent,
                BitstreamFormatsComponent,
                MetadataSchemaFormComponent,
                MetadataFieldFormComponent
            ],
            entryComponents: []
        })
    ], AdminRegistriesModule);
    return AdminRegistriesModule;
}());
export { AdminRegistriesModule };
//# sourceMappingURL=admin-registries.module.js.map