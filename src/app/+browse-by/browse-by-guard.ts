import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { DSpaceObjectDataService } from '../core/data/dspace-object-data.service';
import { hasNoValue, hasValue } from '../shared/empty.util';
import { map } from 'rxjs/operators';
import { getFirstSucceededRemoteData } from '../core/shared/operators';
import { TranslateService } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { environment } from '../../environments/environment';

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
    const id = route.params.id || route.queryParams.id || route.data.id;
    let metadataField = route.data.metadataField;
    if (hasNoValue(metadataField) && hasValue(id)) {
      const config = environment.browseBy.types.find((conf) => conf.id === id);
      if (hasValue(config) && hasValue(config.metadataField)) {
        metadataField = config.metadataField;
      }
    }
    const scope = route.queryParams.scope;
    const value = route.queryParams.value;
    const metadataTranslated = this.translate.instant('browse.metadata.' + id);
    if (hasValue(scope)) {
      const dsoAndMetadata$ = this.dsoService.findById(scope).pipe(getFirstSucceededRemoteData());
      return dsoAndMetadata$.pipe(
        map((dsoRD) => {
          const name = dsoRD.payload.name;
          route.data = this.createData(title, id, metadataField, name, metadataTranslated, value, route);
          return true;
        })
      );
    } else {
      route.data = this.createData(title, id, metadataField, '', metadataTranslated, value, route);
      return observableOf(true);
    }
  }

  private createData(title, id, metadataField, collection, field, value, route) {
    return Object.assign({}, route.data, {
      title: title,
      id: id,
      metadataField: metadataField,
      collection: collection,
      field: field,
      value: hasValue(value) ? `"${value}"` : ''
    });
  }
}
