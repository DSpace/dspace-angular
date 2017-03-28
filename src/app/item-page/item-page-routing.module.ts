import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ItemPageComponent } from './item-page.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'item/:id', pathMatch: 'full', component: ItemPageComponent },
        ])
    ]
})
export class ItemPageRoutingModule {
}
