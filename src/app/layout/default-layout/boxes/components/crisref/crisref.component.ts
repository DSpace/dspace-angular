import { Component, OnInit } from '@angular/core';

import { from as observableFrom, Observable, of as observableOf, Subscription } from 'rxjs';
import { concatMap, map, reduce, tap } from 'rxjs/operators';

import { RenderingTypeModelComponent } from '../rendering-type.model';
import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { hasValue } from '../../../../../shared/empty.util';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { getFirstCompletedRemoteData } from '../../../../../core/shared/operators';
import { environment } from '../../../../../../environments/environment';
import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { RemoteData } from '../../../../../core/data/remote-data';
import { Item } from '../../../../../core/shared/item.model';
import { TranslateService } from '@ngx-translate/core';
/**
 * This component renders the crisref metadata fields
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'span[ds-crisref]',
  templateUrl: './crisref.component.html',
  styleUrls: ['./crisref.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.CRISREF)
export class CrisrefComponent extends RenderingTypeModelComponent implements OnInit {

  /**
   * List of item metadatas to show
   */
  metadatas: MetadataValue[];

  constructor( protected translateService: TranslateService) {
    super(translateService);
  }

  ngOnInit() {
    const itemMetadata: MetadataValue[] = this.item.allMetadata( this.field.metadata );
    let itemsToBeRendered = [];
    if (this.indexToBeRendered >= 0) {
      itemsToBeRendered.push(itemMetadata[this.indexToBeRendered]);
    } else {
      itemsToBeRendered = [...itemMetadata];
    }

    this.metadatas = itemsToBeRendered;

  }

}
