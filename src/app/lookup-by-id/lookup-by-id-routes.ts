import {
  Route,
  UrlSegment,
} from '@angular/router';

import { isNotEmpty } from '../shared/empty.util';
import { lookupGuard } from './lookup-guard';
import { ThemedObjectGoneComponent } from './objectgone/themed-objectgone.component';
import { ThemedObjectNotFoundComponent } from './objectnotfound/themed-objectnotfound.component';

export const ROUTES: Route[] = [
  {
    matcher: urlMatcher,
    canActivate: [lookupGuard],
    component: ThemedObjectNotFoundComponent,
  },
  {
    path: 'object-gone',
    component: ThemedObjectGoneComponent,
  },
];


export function urlMatcher(url) {
  // The expected path is :idType/:id
  const idType = url[0].path;
  // Allow for handles that are delimited with a forward slash.
  const id = url
    .slice(1)
    .map((us: UrlSegment) => us.path)
    .join('/');
  if (isNotEmpty(idType) && isNotEmpty(id)) {
    return {
      consumed: url,
      posParams: {
        idType: new UrlSegment(idType, {}),
        id: new UrlSegment(id, {}),
      },
    };
  }
  return null;
}
