import { Component, Inject, OnInit } from '@angular/core';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { TranslateService } from '@ngx-translate/core';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { Observable } from 'rxjs';
import { getFirstSucceededRemoteDataPayload } from '../../../../../core/shared/operators';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'ds-cris-layout-collection-box',
  templateUrl: './cris-layout-collection-box.component.html',
  styleUrls: ['./cris-layout-collection-box.component.scss']
})
@RenderCrisLayoutBoxFor(LayoutBox.COLLECTIONS)
export class CrisLayoutCollectionBoxComponent extends CrisLayoutBoxModelComponent implements OnInit {

  owningCollectionName$: Observable<string>;

  owningCollectionId$: Observable<string>;

  constructor(
    protected translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item
  ) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit(): void {
    super.ngOnInit();

    const collection$ = this.item.owningCollection.pipe(
      getFirstSucceededRemoteDataPayload(),
      shareReplay(),
    );

    this.owningCollectionName$ = collection$.pipe(
      map((coll) => coll.firstMetadataValue('dc.title')),
    );

    this.owningCollectionId$ = collection$.pipe(
      map((coll) => coll.uuid),
    );

  }


}
