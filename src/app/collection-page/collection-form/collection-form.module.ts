import { NgModule } from '@angular/core';

import { ComcolModule } from '../../shared/comcol/comcol.module';
import { FormModule } from '../../shared/form/form.module';
import { SharedModule } from '../../shared/shared.module';
import { CollectionFormComponent } from './collection-form.component';

@NgModule({
  imports: [
    ComcolModule,
    FormModule,
    SharedModule,
  ],
  declarations: [
    CollectionFormComponent,
  ],
  exports: [
    CollectionFormComponent,
  ],
})
export class CollectionFormModule {

}
