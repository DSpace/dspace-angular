
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  DynamicLayoutBox,
  MetadataBoxConfiguration,
} from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { DynamicLayoutBoxModelComponent } from '../../../../models/dynamic-layout-box-component.model';
import { RowComponent } from './row/row.component';

/**
 * This component renders the metadata boxes of items
 */
@Component({
  selector: 'ds-dynamic-layout-metadata-box',
  templateUrl: './dynamic-layout-metadata-box.component.html',
  styleUrls: ['./dynamic-layout-metadata-box.component.scss'],
  imports: [
    RowComponent,
  ],
})
/**
 * For overwrite this component create a new one that extends DynamicLayoutBoxObj and
 * add the DynamicLayoutBoxModelComponent decorator indicating the type of box to overwrite
 */
export class DynamicLayoutMetadataBoxComponent extends DynamicLayoutBoxModelComponent implements OnInit, OnDestroy {

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
    @Inject('boxProvider') public boxProvider: DynamicLayoutBox,
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
