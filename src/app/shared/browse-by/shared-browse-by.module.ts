import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccessControlRoutingModule } from '../../access-control/access-control-routing.module';
import { BrowseByRoutingModule } from '../../browse-by/browse-by-routing.module';
import { ResultsBackButtonModule } from '../results-back-button/results-back-button.module';
import { SharedModule } from '../shared.module';
import { BrowseByComponent } from './browse-by.component';
import { ThemedBrowseByComponent } from './themed-browse-by.component';
import { CommonModule } from '@angular/common';

const DECLARATIONS = [
  BrowseByComponent,
  ThemedBrowseByComponent,
];

@NgModule({
    imports: [
    CommonModule,
    ...DECLARATIONS
],
    exports: [
      ...DECLARATIONS,
  ],
})
export class SharedBrowseByModule {
}
