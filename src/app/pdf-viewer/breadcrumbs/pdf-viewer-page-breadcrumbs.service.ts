import { Injectable } from '@angular/core';
import {
  Observable,
  of,
} from 'rxjs';
import {
  find,
  map,
  switchMap,
} from 'rxjs/operators';

import { getDSORoute } from '../../core/router/utils/dso-route.utils';
import { Breadcrumb } from '../../core/breadcrumbs/models/breadcrumb.model';
import { DSOBreadcrumbsService } from '../../core/breadcrumbs/dso-breadcrumbs.service';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { LinkService } from '../../core/cache/builders/link.service';
import { RemoteData } from '../../core/data/remote-data';
import { BITSTREAM } from '../../core/shared/bitstream.resource-type';
import { BUNDLE } from '../../core/shared/bundle.resource-type';
import { ChildHALResource } from '../../core/shared/child-hal-resource.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { followLink } from '../../core/shared/follow-link-config.model';

@Injectable({
  providedIn: 'root',
})
export class PdfViewerPageBreadcrumbsService extends DSOBreadcrumbsService {
  pdfViewerBreadcrumb = new Breadcrumb('pdf-viewer.breadcrumb.pdf-viewer');
  constructor(
    protected linkService: LinkService,
    protected dsoNameService: DSONameService,
  ) {
    super(linkService, dsoNameService);
  }

  getBreadcrumbs(key: ChildHALResource & DSpaceObject, url: string): Observable<Breadcrumb[]> {
    let breadcrumb;
    if (key.type.toString() === BITSTREAM.value) {
      breadcrumb = this.pdfViewerBreadcrumb;
    } else if (key.type.toString() !== BUNDLE.value) {
      return super.getBreadcrumbs(key, url);
    }
    const propertyName = key.getParentLinkKey();
    return this.linkService.resolveLink(key, followLink(propertyName))[propertyName].pipe(
      find((parentRD: RemoteData<ChildHALResource & DSpaceObject>) => parentRD.hasSucceeded || parentRD.statusCode === 204),
      switchMap((parentRD: RemoteData<ChildHALResource & DSpaceObject>) => {
        if (hasValue(parentRD.payload)) {
          return this.getBreadcrumbs(parentRD.payload, getDSORoute(parentRD.payload));
        }
        return of([]);
      }),
      map((breadcrumbs: Breadcrumb[]) => hasValue(breadcrumb) ? [...breadcrumbs, breadcrumb] : breadcrumbs),
    );
  }
}
