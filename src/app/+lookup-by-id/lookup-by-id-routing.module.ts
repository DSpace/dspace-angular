import { LookupGuard } from './lookup-guard';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ObjectNotFoundComponent } from './objectnotfound/objectnotfound.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: ':idType/:id', canActivate: [LookupGuard], component: ObjectNotFoundComponent  }
    ])
  ],
  providers: [
    LookupGuard
  ]
})

export class LookupRoutingModule {

}
