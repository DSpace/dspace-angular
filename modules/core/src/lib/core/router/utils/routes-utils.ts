import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils';

import { Collection } from '../../shared';
import { Community } from '../../shared';
import { DSpaceObject } from '../../shared';
import { Item } from '../../shared';
import { URLCombiner } from '../../url-combiner';


export const HOME_PAGE_PATH = 'home';

// TODO: make paths constants again!
export function getDSpaceObjectRoute(dso: DSpaceObject): string {
  if (hasValue(dso)) {
    switch ((dso as any).type) {
      case Community.type.value:
        return new URLCombiner('/communities', dso.uuid).toString();
      case Collection.type.value:
        return new URLCombiner('/collections', dso.uuid).toString();
      case Item.type.value:
        const type = dso.firstMetadataValue('dspace.entity.type');

        if (isNotEmpty(type)) {
          return new URLCombiner('/entities', encodeURIComponent(type.toLowerCase()), dso.uuid).toString();
        } else {
          return new URLCombiner('/items', dso.uuid).toString();
        }
    }
  }
}

export function getGroupEditRoute(id: string): string {
  const groupsRoute = new URLCombiner('/access-control', 'groups').toString();
  return new URLCombiner(groupsRoute, id, 'edit').toString();
}

export function getPageInternalServerErrorRoute() {
  return `/500`;
}

export function getBitstreamDownloadRoute(bitstream): string {
  return new URLCombiner('/bitstream', bitstream.uuid, 'download').toString();
}

export function getPageNotFoundRoute() {
  return `/404`;
}

export function getForbiddenRoute() {
  return `/403`;
}


export function getEndUserAgreementPath() {
  return '/info/end-user-agreement';
}
