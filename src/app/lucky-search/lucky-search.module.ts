import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import {SharedModule} from '../shared/shared.module';



@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class LuckySearchModule { }
