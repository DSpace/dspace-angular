import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageRoutingModule } from './collection-page-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CollectionPageRoutingModule
  ],
  declarations: [
    CollectionPageComponent,
  ]
})
export class CollectionPageModule { }
