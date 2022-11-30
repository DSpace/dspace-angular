import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilteredCollectionsComponent } from './filtered-collections/filtered-collections.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormModule } from '../../shared/form/form.module';
import { FilteredItemsComponent } from './filtered-items/filtered-items.component';
import { AdminReportsRoutingModule } from './admin-reports-routing.module';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FiltersComponent } from './filters-section/filters-section.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormModule,
    AdminReportsRoutingModule,
    NgbAccordionModule
  ],
  declarations: [
    FilteredCollectionsComponent,
    FilteredItemsComponent,
    FiltersComponent
  ]
})
export class AdminReportsModule {
}
