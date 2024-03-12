import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { FormModule } from '../../shared/form/form.module';

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
