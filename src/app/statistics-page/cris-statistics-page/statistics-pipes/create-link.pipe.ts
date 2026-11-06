import {
  Pipe,
  PipeTransform,
} from '@angular/core';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import {
  getBitstreamDownloadRoute,
  getCollectionPageRoute,
  getCommunityPageRoute,
  getItemPageRoute,
} from '@dspace/core/router/utils/dso-route.utils';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core/shared/operators';
import { Point } from '@dspace/core/statistics/models/usage-report.model';
import {
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { EntityTypeEnum } from './entity-type.enum';

@Pipe({
  name: 'dsCreateLink',
})
export class CreateLinkPipe implements PipeTransform {
  constructor(private itemService: ItemDataService, private bitstreamService: BitstreamDataService) {
  }

  transform(value: Point): Observable<string> {
    if (value) {
      let link$: Observable<string>;
      switch (value.type as EntityTypeEnum) {
        case EntityTypeEnum.Community:
          link$ = of(getCommunityPageRoute(value.id));
          break;
        case EntityTypeEnum.Collection:
          link$ = of(getCollectionPageRoute(value.id));
          break;
        case EntityTypeEnum.Item:
          link$ = this.itemService.findById(value.id).pipe(
            getFirstSucceededRemoteDataPayload(),
            map((item: Item) => {
              if (item) {
                return getItemPageRoute(item);
              }
            }),
          );
          break;
        case EntityTypeEnum.Bitstream:
          link$ = this.bitstreamService.findById(value.id).pipe(
            getFirstSucceededRemoteDataPayload(),
            map((bitstream: Bitstream) => {
              if (bitstream) {
                return getBitstreamDownloadRoute(bitstream);
              }
            }),
          );
          break;
      }
      return link$.pipe(
        map((link: string) => {
          return link ? `${link}` : '';
        }),
      );
    }
  }
}
