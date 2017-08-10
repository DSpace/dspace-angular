import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SearchService } from './search.service';

@NgModule({
  imports: [
    CoreModule
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [
    SearchService
  ]
})
export class SearchModule {}
