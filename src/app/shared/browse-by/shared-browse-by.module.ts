import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccessControlRoutingModule } from '../../access-control/access-control-routing.module';
import { BrowseByRoutingModule } from '../../browse-by/browse-by-routing.module';
import { ResultsBackButtonModule } from '../results-back-button/results-back-button.module';
import { SharedModule } from '../shared.module';
import { BrowseByComponent } from './browse-by.component';

@NgModule({
  declarations: [
    BrowseByComponent,
  ],
  imports: [
    ResultsBackButtonModule,
    BrowseByRoutingModule,
    AccessControlRoutingModule,
    CommonModule,
    SharedModule,
  ],
  exports: [
    BrowseByComponent,
    SharedModule,
  ],
})
export class SharedBrowseByModule { }
