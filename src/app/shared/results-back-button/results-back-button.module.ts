import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ResultsBackButtonComponent } from './results-back-button.component';


@NgModule({
  declarations: [
    ResultsBackButtonComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    ResultsBackButtonComponent
  ]
})
export class ResultsBackButtonModule {

}
