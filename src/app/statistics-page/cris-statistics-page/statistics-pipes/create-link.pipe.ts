import {
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { getBitstreamDownloadRoute } from '../../../app-routing-paths';
import { getCollectionPageRoute } from '../../../collection-page/collection-page-routing-paths';
import { getCommunityPageRoute } from '../../../community-page/community-page-routing-paths';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { Item } from '../../../core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { Point } from '../../../core/statistics/models/usage-report.model';
import { EntityTypeEnum } from '../../../cris-layout/enums/entity-type.enum';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';

@Pipe({
  name: 'dsCreateLink',
  standalone: true,
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
