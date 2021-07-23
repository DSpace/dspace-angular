import { NgModule } from '@angular/core';

import { CollectionFormComponent } from './collection-form.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    CollectionFormComponent,
  ],
  exports: [
    CollectionFormComponent
  ]
})
export class CollectionFormModule {

}
