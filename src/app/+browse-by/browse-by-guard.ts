import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { DSpaceObjectDataService } from '../core/data/dspace-object-data.service';
import { hasValue } from '../shared/empty.util';
import { map } from 'rxjs/operators';
import { getSucceededRemoteData } from '../core/shared/operators';
import { TranslateService } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

@Injectable()
/**
 * A guard taking care of the correct route.data being set for the Browse-By components
 */
export class BrowseByGuard implements CanActivate {

  constructor(protected dsoService: DSpaceObjectDataService,
              protected translate: TranslateService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const title = route.data.title;
    const metadata = route.params.metadata || route.queryParams.metadata || route.data.metadata;
    const metadataField = route.data.metadataField;
    const scope = route.queryParams.scope;
    const value = route.queryParams.value;
    const metadataTranslated = this.translate.instant('browse.metadata.' + metadata);
    if (hasValue(scope)) {
      const dsoAndMetadata$ = this.dsoService.findById(scope).pipe(getSucceededRemoteData());
      return dsoAndMetadata$.pipe(
        map((dsoRD) => {
          const name = dsoRD.payload.name;
          route.data = this.createData(title, metadata, metadataField, name, metadataTranslated, value);
          return true;
        })
      );
    } else {
      route.data = this.createData(title, metadata, metadataField, '', metadataTranslated, value);
      return observableOf(true);
    }
  }

  private createData(title, metadata, metadataField, collection, field, value) {
    return {
      title: title,
      metadata: metadata,
      metadataField: metadataField,
      collection: collection,
      field: field,
      value: hasValue(value) ? `"${value}"` : ''
    }
  }
}
