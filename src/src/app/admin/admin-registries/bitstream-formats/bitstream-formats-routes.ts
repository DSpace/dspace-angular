import { Route } from '@angular/router';

import { i18nBreadcrumbResolver } from '../../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { AddBitstreamFormatComponent } from './add-bitstream-format/add-bitstream-format.component';
import { BitstreamFormatsComponent } from './bitstream-formats.component';
import { bitstreamFormatsResolver } from './bitstream-formats.resolver';
import { EditBitstreamFormatComponent } from './edit-bitstream-format/edit-bitstream-format.component';

const BITSTREAMFORMAT_EDIT_PATH = ':id/edit';
const BITSTREAMFORMAT_ADD_PATH = 'add';

const providers = [];

export const ROUTES: Route[] = [
  {
    path: '',
    providers,
    component: BitstreamFormatsComponent,
  },
  {
    path: BITSTREAMFORMAT_ADD_PATH,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    providers,
    component: AddBitstreamFormatComponent,
    data: { breadcrumbKey: 'admin.registries.bitstream-formats.create' },
  },
  {
    path: BITSTREAMFORMAT_EDIT_PATH,
    providers,
    component: EditBitstreamFormatComponent,
    resolve: {
      bitstreamFormat: bitstreamFormatsResolver,
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: { breadcrumbKey: 'admin.registries.bitstream-formats.edit' },
  },
];
