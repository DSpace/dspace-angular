import { LookupGuard } from './lookup-guard';
import { NgModule } from '@angular/core';
import { RouterModule, UrlSegment } from '@angular/router';
import { ObjectNotFoundComponent } from './objectnotfound/objectnotfound.component';
import { hasValue } from '../shared/empty.util';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        matcher: (url) => {
          // The expected path is :idType/:id
          const idType = url[0].path;
          let id;
          // Allow for handles that are delimited with a forward slash.
          if (url.length === 3) {
            id = url[1].path + '/' + url[2].path;
          } else {
            id = url[1].path;
          }
          if (hasValue(idType) && hasValue(id)) {
            return {
              consumed: url,
              posParams: {
                idType: new UrlSegment(idType, {}),
                id: new UrlSegment(id, {})
              }
            };
          }
          return null;
        },
        canActivate: [LookupGuard],
        component: ObjectNotFoundComponent  }
    ])
  ],
  providers: [
    LookupGuard
  ]
})

export class LookupRoutingModule {

}
