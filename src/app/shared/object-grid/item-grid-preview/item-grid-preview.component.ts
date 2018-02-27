import { Component, Input } from '@angular/core';
import { hasNoValue, hasValue, isEmpty } from '../../empty.util';
import { Metadatum } from '../../../core/shared/metadatum.model';
import { Item } from '../../../core/shared/item.model';
import { ItemStatus } from '../../../core/shared/item-status';
import { MetadataService } from '../../../core/metadata/metadata.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { ItemDataService } from '../../../core/data/item-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { Bitstream } from '../../../core/shared/bitstream.model';

@Component({
  selector: 'ds-item-grid-preview',
  styleUrls: ['item-grid-preview.component.scss'],
  templateUrl: 'item-grid-preview.component.html'
})

export class ItemGridPreviewComponent<T> {

  // id: number;
  //
  // private sub: any;
  //
  // itemRDObs: Observable<RemoteData<Item>>;
  //
  // thumbnailObs: Observable<Bitstream>;
  //
  // constructor(
  //   private route: ActivatedRoute,
  //   private items: ItemDataService,
  //   private metadataService: MetadataService
  // ) {
  //
  // }
  //
  // ngOnInit(): void {
  //   this.sub = this.route.params.subscribe((params) => {
  //     this.initialize(params);
  //   });
  // }
  //
  // initialize(params) {
  //   this.id = +params.id;
  //   this.itemRDObs = this.items.findById(params.id);
  //   this.metadataService.processRemoteData(this.itemRDObs);
  //   this.thumbnailObs = this.itemRDObs
  //     .map((rd: RemoteData<Item>) => rd.payload)
  //     .filter((item: Item) => hasValue(item))
  //     .flatMap((item: Item) => item.getThumbnail());
  // }
  @Input()
  item: Item;
  @Input()
  object: any;
  @Input()
  statusTxt: string = ItemStatus.IN_PROGRESS; // Default value
  public ALL_STATUS = [];

  ngOnInit() {
    Object.keys(ItemStatus).forEach((s) => {
      this.ALL_STATUS.push(ItemStatus[s]);
    });

  }

  getTitle(): string {
    return this.item.findMetadata('dc.title');
  }

  getDate(): string {
    return this.item.findMetadata('dc.date.issued');
  }

  getValues(keys: string[]): string[] {
    const results: string[] = new Array<string>();
    this.object.hitHighlights.forEach(
      (md: Metadatum) => {
        if (keys.indexOf(md.key) > -1) {
          results.push(md.value);
        }
      }
    );
    if (isEmpty(results)) {
      this.item.filterMetadata(keys).forEach(
        (md: Metadatum) => {
          results.push(md.value);
        }
      );
    }
    return results;
  }

  getFirstValue(key: string): string {
    let result: string;
    this.object.hitHighlights.some(
      (md: Metadatum) => {
        if (key === md.key) {
          result = md.value;
          return true;
        }
      }
    );
    if (hasNoValue(result)) {
      result = this.item.findMetadata(key);
    }
    return result;
  }

}
