import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NewProcessComponent } from './new/new-process.component';
import { ProcessOverviewComponent } from './overview/process-overview.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProcessOverviewComponent,
      },
      {
        path: 'new',
        component: NewProcessComponent,
        data: { title: 'process.new.title' }
      },
    ])
  ]
})
export class ProcessPageRoutingModule {

}
