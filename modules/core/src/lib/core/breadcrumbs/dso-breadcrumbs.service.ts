import { Injectable } from '@angular/core';
import { hasValue } from '@dspace/shared/utils';
import {
  Observable,
  of as observableOf,
} from 'rxjs';
import {
  find,
  map,
  switchMap,
} from 'rxjs/operators';

import { LinkService } from '../cache';
import {
  followLink,
  RemoteData,
} from '../data';
import { getDSpaceObjectRoute } from '../router';
import {
  ChildHALResource,
  DSpaceObject,
} from '../shared';
import { Breadcrumb } from './breadcrumb.model';
import { BreadcrumbsProviderService } from './breadcrumbsProviderService';
import { DSONameService } from './dso-name.service';

/**
 * Service to calculate DSpaceObject breadcrumbs for a single part of the route
 */
@Injectable({
  providedIn: 'root',
})
export class DSOBreadcrumbsService implements BreadcrumbsProviderService<ChildHALResource & DSpaceObject> {
  constructor(
    protected linkService: LinkService,
    protected dsoNameService: DSONameService,
  ) {

  }

  /**
   * Method to recursively calculate the breadcrumbs
   * This method returns the name and url of the key and all its parent DSOs recursively, top down
   * @param key The key (a DSpaceObject) used to resolve the breadcrumb
   * @param url The url to use as a link for this breadcrumb
   */
  getBreadcrumbs(key: ChildHALResource & DSpaceObject, url: string): Observable<Breadcrumb[]> {
    const label = this.dsoNameService.getName(key);
    const crumb = new Breadcrumb(label, url);
    const propertyName = key.getParentLinkKey();
    return this.linkService.resolveLink(key, followLink(propertyName))[propertyName].pipe(
      find((parentRD: RemoteData<ChildHALResource & DSpaceObject>) => parentRD.hasSucceeded || parentRD.statusCode === 204),
      switchMap((parentRD: RemoteData<ChildHALResource & DSpaceObject>) => {
        if (hasValue(parentRD) && hasValue(parentRD.payload)) {
          const parent = parentRD.payload;
          return this.getBreadcrumbs(parent, getDSpaceObjectRoute(parent));
        }
        return observableOf([]);

      }),
      map((breadcrumbs: Breadcrumb[]) => [...breadcrumbs, crumb]),
    );
  }
}
