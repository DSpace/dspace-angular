import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormModule } from '../../shared/form/form.module';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormModule,
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
