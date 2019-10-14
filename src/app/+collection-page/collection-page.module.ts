import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageRoutingModule } from './collection-page-routing.module';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { EditCollectionPageComponent } from './edit-collection-page/edit-collection-page.component';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';
import { SearchService } from '../+search-page/search-service/search.service';
import { CollectionItemMapperComponent } from './collection-item-mapper/collection-item-mapper.component';
import { SearchFixedFilterService } from '../+search-page/search-filters/search-filter/search-fixed-filter.service';
import { StatisticsModule } from '../statistics/statistics.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CollectionPageRoutingModule,
    StatisticsModule.forRoot()
  ],
  declarations: [
    CollectionPageComponent,
    CreateCollectionPageComponent,
    EditCollectionPageComponent,
    DeleteCollectionPageComponent,
    CollectionFormComponent,
    CollectionItemMapperComponent
  ],
  providers: [
    SearchService,
    SearchFixedFilterService
  ]
})
export class CollectionPageModule {

}
