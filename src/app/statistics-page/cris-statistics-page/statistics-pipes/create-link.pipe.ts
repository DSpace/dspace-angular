import { BitstreamDataService } from './../../../core/data/bitstream-data.service';
import { Bitstream } from './../../../core/shared/bitstream.model';
import { getRemoteDataPayload } from './../../../core/shared/operators';
import { ItemDataService } from './../../../core/data/item-data.service';
import { EntityTypeEnum } from './../../../cris-layout/enums/entity-type.enum';
import { Point } from './../../../core/statistics/models/usage-report.model';
import { Pipe, PipeTransform } from '@angular/core';
import { getItemPageRoute } from 'src/app/item-page/item-page-routing-paths';
import { Item } from 'src/app/core/shared/item.model';
import { getBitstreamDownloadRoute } from 'src/app/app-routing-paths';
import { getCommunityPageRoute } from 'src/app/community-page/community-page-routing-paths';
import { getCollectionPageRoute } from 'src/app/collection-page/collection-page-routing-paths';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'dsCreateLink',
})
export class CreateLinkPipe implements PipeTransform {
  constructor(private itemService: ItemDataService , private bitstreamService: BitstreamDataService) {}

  transform(value: Point): Observable<string> {
    if (value) {
      let link$: Observable<string>;
      switch (value.type) {
        case EntityTypeEnum.Community:
          link$ = of(getCommunityPageRoute(value.id));
          break;
        case EntityTypeEnum.Collection:
          link$ = of(getCollectionPageRoute(value.id));
          break;
        case EntityTypeEnum.Item:
          link$ = this.itemService.findById(value.id).pipe(
            getRemoteDataPayload<Item>(),
            map((item: Item) => {
              if (item) {
                 return getItemPageRoute(item);
              }
            })
          );
          break;
        case EntityTypeEnum.Bitstream:
          link$ = this.bitstreamService.findById(value.id).pipe(
            getRemoteDataPayload<Bitstream>(),
            map((bitstream: Bitstream) => {
              if (bitstream) {
                 return getBitstreamDownloadRoute(bitstream);
              }
            })
          );
          break;
      }
      return link$.pipe(
        map((link: string) => {
          return link? `${environment.ui.baseUrl}${link}` : '';
        })
      );
    }
  }
}
