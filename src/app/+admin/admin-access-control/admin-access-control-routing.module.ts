import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EPeopleRegistryComponent } from './epeople-registry/epeople-registry.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'epeople', component: EPeopleRegistryComponent, data: { title: 'admin.access-control.epeople.title' } },
    ])
  ]
})
export class AdminAccessControlRoutingModule {

}
