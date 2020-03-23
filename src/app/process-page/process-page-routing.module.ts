import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NewProcessComponent } from './new/new-process.component';
import { ProcessOverviewComponent } from './overview/process-overview.component';
import { ProcessPageResolver } from './process-page.resolver';
import { ProcessDetailComponent } from './detail/process-detail.component';

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
      {
        path: ':id',
        component: ProcessDetailComponent,
        resolve: {
          process: ProcessPageResolver
        }
      }
    ])
  ],
  providers: [
    ProcessPageResolver
  ]
})
export class ProcessPageRoutingModule {

}
