import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiradorViewerComponent } from './mirador-viewer.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    MiradorViewerComponent
  ],
  exports: [
    MiradorViewerComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule
  ]
})
export class MiradorViewerModule { }
