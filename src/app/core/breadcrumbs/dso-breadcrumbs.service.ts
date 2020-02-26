import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsService } from './breadcrumbs.service';
import { DSONameService } from './dso-name.service';
import { Observable, of as observableOf } from 'rxjs';
import { ChildHALResource } from '../shared/child-hal-resource.model';
import { LinkService } from '../cache/builders/link.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { find, map, switchMap } from 'rxjs/operators';
import { getDSOPath } from '../../app-routing.module';
import { RemoteData } from '../data/remote-data';
import { hasValue } from '../../shared/empty.util';
import { Injectable } from '@angular/core';

@Injectable()
export class DSOBreadcrumbsService implements BreadcrumbsService<ChildHALResource & DSpaceObject> {
  constructor(
    private linkService: LinkService,
    private dsoNameService: DSONameService
  ) {

  }

  getBreadcrumbs(key: ChildHALResource & DSpaceObject, url: string): Observable<Breadcrumb[]> {
    const label = this.dsoNameService.getName(key);
    const crumb = new Breadcrumb(label, url);
    const propertyName = key.getParentLinkKey();
    return this.linkService.resolveLink(key, followLink(propertyName))[propertyName].pipe(
      find((parentRD: RemoteData<ChildHALResource & DSpaceObject>) => parentRD.hasSucceeded || parentRD.statusCode === 204),
      switchMap((parentRD: RemoteData<ChildHALResource & DSpaceObject>) => {
        if (hasValue(parentRD.payload)) {
          const parent = parentRD.payload;
          return this.getBreadcrumbs(parent, getDSOPath(parent))
        }
        return observableOf([]);

      }),
      map((breadcrumbs: Breadcrumb[]) => [...breadcrumbs, crumb])
    );
  }
}
