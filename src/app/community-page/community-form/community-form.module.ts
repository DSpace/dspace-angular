import { NgModule } from '@angular/core';

import { CommunityFormComponent } from './community-form.component';
import { ComcolModule } from '../../shared/comcol/comcol.module';
import { FormModule } from '../../shared/form/form.module';

@NgModule({
    imports: [
        ComcolModule,
        FormModule,
        CommunityFormComponent
    ],
    exports: [
        CommunityFormComponent
    ]
})
export class CommunityFormModule {

}
