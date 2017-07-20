import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageRoutingModule } from './collection-page-routing.module';

@NgModule({
  imports: [
    CollectionPageRoutingModule,
    CommonModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [
    CollectionPageComponent,
  ]
})
export class CollectionPageModule { }
