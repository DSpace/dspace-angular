import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NewProcessComponent } from './new/new-process.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'new',
        component: NewProcessComponent,
      },
    ])
  ]
})
export class ProcessPageRoutingModule {

}
