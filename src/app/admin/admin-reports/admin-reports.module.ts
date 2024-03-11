import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { FormModule } from '../../shared/form/form.module';
import { SharedModule } from '../../shared/shared.module';
import { AdminReportsRoutingModule } from './admin-reports-routing.module';
import { FilteredCollectionsComponent } from './filtered-collections/filtered-collections.component';
import { FilteredItemsComponent } from './filtered-items/filtered-items.component';
import { FiltersComponent } from './filters-section/filters-section.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormModule,
    AdminReportsRoutingModule,
    NgbAccordionModule,
  ],
  declarations: [
    FilteredCollectionsComponent,
    FilteredItemsComponent,
    FiltersComponent,
  ],
})
export class AdminReportsModule {
}
