import { CountersSectionComponent } from './section-component/counters-section/counters-section.component';
import { TextSectionComponent } from './section-component/text-section/text-section.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ExploreRoutingModule } from './explore-routing.module';
import { ExploreComponent } from './explore.component';
import { BrowseSectionComponent } from './section-component/browse-section/browse-section.component';
import { TopSectionComponent } from './section-component/top-section/top-section.component';
import { FacetSectionComponent } from './section-component/facet-section/facet-section.component';
import { SearchSectionComponent } from './section-component/search-section/search-section.component';

@NgModule({
    imports: [
        ExploreRoutingModule,
        CommonModule,
        SharedModule
    ],
    declarations: [
        ExploreComponent,
        BrowseSectionComponent,
        TopSectionComponent,
        FacetSectionComponent,
        SearchSectionComponent,
        TextSectionComponent,
        CountersSectionComponent
    ],
    providers: [],
    entryComponents: [
        ExploreComponent,
        BrowseSectionComponent,
        TopSectionComponent,
        FacetSectionComponent,
        SearchSectionComponent,
        TextSectionComponent,
        CountersSectionComponent
    ]
})
export class ExploreModule {

}
