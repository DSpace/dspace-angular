import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Data,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { BrowseDefinitionDataService } from '@dspace/core/browse/browse-definition-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { PAGE_NOT_FOUND_PATH } from '@dspace/core/router/core-routing-paths';
import { BrowseDefinition } from '@dspace/core/shared/browse-definition.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import {
  hasNoValue,
  hasValue,
} from '@dspace/shared/utils/empty.util';
import { TranslateService } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

export const browseByGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  browseDefinitionService: BrowseDefinitionDataService = inject(BrowseDefinitionDataService),
  router: Router = inject(Router),
  translate: TranslateService = inject(TranslateService),
): Observable<boolean> => {
  const title = route.data.title;
  const id = route.params.id || route.queryParams.id || route.data.id;
  let browseDefinition$: Observable<BrowseDefinition | undefined>;
  if (hasNoValue(route.data.browseDefinition) && hasValue(id)) {
    browseDefinition$ = browseDefinitionService.findById(id).pipe(
      getFirstCompletedRemoteData(),
      map((browseDefinitionRD: RemoteData<BrowseDefinition>) => browseDefinitionRD.payload),
    );
  } else {
    browseDefinition$ = of(route.data.browseDefinition);
  }
  const scope = route.queryParams.scope ?? route.parent?.params.id;
  const value = route.queryParams.value;
  const metadataTranslated = translate.instant(`browse.metadata.${id}`);
  return browseDefinition$.pipe(
    switchMap((browseDefinition: BrowseDefinition | undefined) => {
      if (hasValue(browseDefinition)) {
        route.data = createData(title, id, browseDefinition, metadataTranslated, value, route, scope);
        return of(true);
      } else {
        void router.navigate([PAGE_NOT_FOUND_PATH]);
        return of(false);
      }
    }),
  );
};

function createData(title: string, id: string, browseDefinition: BrowseDefinition, field: string, value: string, route: ActivatedRouteSnapshot, scope: string): Data {
  return Object.assign({}, route.data, {
    title: title,
    id: id,
    browseDefinition: browseDefinition,
    field: field,
    value: hasValue(value) ? `"${value}"` : '',
    scope: scope,
  });
}
