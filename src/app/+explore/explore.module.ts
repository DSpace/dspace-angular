import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ExploreRoutingModule } from './explore-routing.module';
import { ExploreComponent } from './explore.component';

@NgModule({
    imports: [
        ExploreRoutingModule,
        CommonModule,
        SharedModule
    ],
    declarations: [
        ExploreComponent,
    ],
    providers: [],
    entryComponents: [
        ExploreComponent
    ]
})
export class ExploreModule {

}
