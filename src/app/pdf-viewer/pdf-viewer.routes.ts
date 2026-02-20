import { Route } from '@angular/router';

import { bitstreamPageResolver } from '../bitstream-page/bitstream-page.resolver';
import { PdfViewerPageComponent } from './pdf-viewer-page/pdf-viewer-page.component';
import { pdfViewerPageBreadcrumbResolver } from './breadcrumbs/pdf-viewer-page-breadcrumb.resolver';

export const ROUTES: Route[] = [
  {
    path: ':id',
    resolve: {
      bitstream: bitstreamPageResolver,
      breadcrumb: pdfViewerPageBreadcrumbResolver,
    },
    children: [
      {
        path: '',
        redirectTo: 'page/1',
        pathMatch: 'full',
      },
      {
        path: 'page/:page-number',
        component: PdfViewerPageComponent,
      },
    ],
  },
];
