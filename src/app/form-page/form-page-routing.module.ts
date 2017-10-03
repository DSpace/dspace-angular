import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormPageComponent } from './form-page.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'forms', pathMatch: 'full', component: FormPageComponent }
        ])
    ]
})
export class FormPageRoutingModule {
}
