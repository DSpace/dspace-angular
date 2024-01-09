import { NgModule } from '@angular/core';

import { CollectionFormComponent } from './collection-form.component';
import { ComcolModule } from '../../shared/comcol/comcol.module';
import { FormModule } from '../../shared/form/form.module';

@NgModule({
    imports: [
        ComcolModule,
        FormModule,
        CollectionFormComponent
    ],
    exports: [
        CollectionFormComponent
    ]
})
export class CollectionFormModule {

}
