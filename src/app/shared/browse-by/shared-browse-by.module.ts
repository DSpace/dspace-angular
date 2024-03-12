import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BrowseByComponent } from './browse-by.component';
import { ThemedBrowseByComponent } from './themed-browse-by.component';

const DECLARATIONS = [
  BrowseByComponent,
  ThemedBrowseByComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ...DECLARATIONS,
  ],
  exports: [
    ...DECLARATIONS,
  ],
})
export class SharedBrowseByModule {
}
