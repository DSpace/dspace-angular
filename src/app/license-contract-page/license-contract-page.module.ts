import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LicenseContractPageComponent } from './license-contract-page.component';
import { SharedModule } from '../shared/shared.module';
import { LicenseContractPageRoutingModule } from './license-contract-page-routing.module';

@NgModule({
  declarations: [
    LicenseContractPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LicenseContractPageRoutingModule
  ]
})
export class LicenseContractPageModule { }
