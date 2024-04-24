import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownViewerComponent } from './markdown-viewer.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [ MarkdownViewerComponent ],
  exports: [ MarkdownViewerComponent ],
  imports: [ CommonModule, SharedModule ]
})
export class MarkdownViewerModule { }
