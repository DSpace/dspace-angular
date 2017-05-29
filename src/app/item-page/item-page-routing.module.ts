import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ItemPageComponent } from './simple/item-page.component';
import { FullItemPageComponent } from './full/full-item-page.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'items/:id', pathMatch: 'full', component: ItemPageComponent },
            { path: 'items/:id/full', component: FullItemPageComponent },
        ])
    ]
})
export class ItemPageRoutingModule {
}
