import { NgModule } from '@angular/core';
import { MatButtonModule, MatButtonToggleModule, MatIconModule, MatTreeModule } from '@angular/material';
import { CdkTreeModule } from '@angular/cdk/tree';

@NgModule({
  exports: [
    CdkTreeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTreeModule
  ]
})
export class MaterialModule {
}
