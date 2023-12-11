import { NgModule } from '@angular/core';
import { BrowseByComponent } from './browse-by.component';
import { ThemedBrowseByComponent } from './themed-browse-by.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { ResultsBackButtonModule } from '../results-back-button/results-back-button.module';
import { BrowseByRoutingModule } from '../../browse-by/browse-by-routing.module';
import { AccessControlRoutingModule } from '../../access-control/access-control-routing.module';

const DECLARATIONS = [
  BrowseByComponent,
  ThemedBrowseByComponent,
];

@NgModule({
    imports: [
        ResultsBackButtonModule,
        BrowseByRoutingModule,
        AccessControlRoutingModule,
        CommonModule,
        SharedModule,
        ...DECLARATIONS,
    ],
    exports: [
      ...DECLARATIONS,
        SharedModule,
    ]
})
export class SharedBrowseByModule { }
