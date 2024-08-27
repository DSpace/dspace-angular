import { NgFor } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import {
  CrisLayoutBox,
  MetadataBoxConfiguration,
} from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { hasValue } from '../../../../../shared/empty.util';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { RowComponent } from './row/row.component';

/**
 * This component renders the metadata boxes of items
 */
@Component({
  selector: 'ds-cris-layout-metadata-box',
  templateUrl: './cris-layout-metadata-box.component.html',
  styleUrls: ['./cris-layout-metadata-box.component.scss'],
  standalone: true,
  imports: [NgFor, RowComponent],
})
/**
 * For overwrite this component create a new one that extends CrisLayoutBoxObj and
 * add the CrisLayoutBoxModelComponent decorator indicating the type of box to overwrite
 */
export class CrisLayoutMetadataBoxComponent extends CrisLayoutBoxModelComponent implements OnInit, OnDestroy {

  /**
   * Contains the fields configuration for current box
   */
  metadataBoxConfiguration: MetadataBoxConfiguration;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor(
    public cdr: ChangeDetectorRef,
    protected translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item,
  ) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit() {
    super.ngOnInit();
    this.setMetadataComponents(this.box.configuration as MetadataBoxConfiguration);
  }

  /**
   * Set the metadataBoxConfiguration.
   * @param metadatacomponents
   */
  setMetadataComponents(metadatacomponents: MetadataBoxConfiguration) {
    this.metadataBoxConfiguration = metadatacomponents;
    this.cdr.detectChanges();
  }

  /**
   * Unsubscribes all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
