import { EntityTypeEnum } from './../../../cris-layout/enums/entity-type.enum';
import { Point } from './../../../core/statistics/models/usage-report.model';
import { Pipe, PipeTransform } from '@angular/core';
import { getItemPageRoute } from 'src/app/item-page/item-page-routing-paths';
import { Item } from 'src/app/core/shared/item.model';
import { getBitstreamDownloadRoute } from 'src/app/app-routing-paths';
import { getCommunityPageRoute } from 'src/app/community-page/community-page-routing-paths';
import { getCollectionPageRoute } from 'src/app/collection-page/collection-page-routing-paths';

@Pipe({
  name: 'dsCreateLink',
})
export class CreateLinkPipe implements PipeTransform {
  transform(value: Point): string {
    if (value) {
      let link = '';
      switch (value.type) {
        case EntityTypeEnum.Community:
          link = getCommunityPageRoute(value.id);
          break;
        case EntityTypeEnum.Collection:
          link = getCollectionPageRoute(value.id);
          break;
        case EntityTypeEnum.Item:
          const item = new Item();
          item.id = value.id;
          link = getItemPageRoute(item);
          break;
        case EntityTypeEnum.Bitstream:
          link = getBitstreamDownloadRoute(value);
          break;
        default:
          return link;
      }
      return link;
    }
  }
}
