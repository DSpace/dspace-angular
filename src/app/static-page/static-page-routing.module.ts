import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaticPageComponent } from './static-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: StaticPageComponent },
      { path: ':htmlFileName', component: StaticPageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticPageRoutingModule { }
