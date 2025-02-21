import { Injectable } from '@angular/core';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils';
import {
  Observable,
  of as observableOf,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { LinkService } from '../cache';
import { BitstreamDataService } from '../data';
import { RemoteData } from '../data';
import { getDSpaceObjectRoute } from '../router';
import { Bitstream } from '../shared';
import { Bundle } from '../shared';
import { ChildHALResource } from '../shared';
import { DSpaceObject } from '../shared';
import { Item } from '../shared';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../shared';
import { BITSTREAM_PAGE_LINKS_TO_FOLLOW } from '../shared';
import { Breadcrumb } from './breadcrumb.model';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';
import { DSONameService } from './dso-name.service';

/**
 * Service to calculate DSpaceObject breadcrumbs for a single part of the route
 */
@Injectable({
  providedIn: 'root',
})
export class BitstreamBreadcrumbsService extends DSOBreadcrumbsService {
  constructor(
    protected bitstreamService: BitstreamDataService,
    protected linkService: LinkService,
    protected dsoNameService: DSONameService,
  ) {
    super(linkService, dsoNameService);
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

    return this.getOwningItem(key.uuid).pipe(
      switchMap((parentRD: RemoteData<ChildHALResource & DSpaceObject>) => {
        if (isNotEmpty(parentRD) && hasValue(parentRD.payload)) {
          const parent = parentRD.payload;
          return super.getBreadcrumbs(parent, getDSpaceObjectRoute(parent));
        }
        return observableOf([]);

      }),
      map((breadcrumbs: Breadcrumb[]) => [...breadcrumbs, crumb]),
    );
  }

  getOwningItem(uuid: string): Observable<RemoteData<Item>> {
    return this.bitstreamService.findById(uuid, true, true, ...BITSTREAM_PAGE_LINKS_TO_FOLLOW).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      switchMap((bitstream: Bitstream) => {
        if (hasValue(bitstream)) {
          return bitstream.bundle.pipe(
            getFirstCompletedRemoteData(),
            getRemoteDataPayload(),
            switchMap((bundle: Bundle) => {
              if (hasValue(bundle)) {
                return bundle.item.pipe(
                  getFirstCompletedRemoteData(),
                );
              } else {
                return observableOf(undefined);
              }
            }),
          );
        } else {
          return observableOf(undefined);
        }
      }),
    );
  }
}
