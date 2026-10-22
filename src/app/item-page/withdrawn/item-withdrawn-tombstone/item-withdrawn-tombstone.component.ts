import {
  Component,
  Inject,
  Input,
  OnChanges,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { WithdrawnFieldConfig } from '@dspace/config/withdrawn-item-config.interface';
import { Item } from '@dspace/core/shared/item.model';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';

import {
  isAbsoluteUrl,
  resolveWithdrawnFields,
  withdrawnFieldLabelKey,
} from '../item-withdrawn-metadata';

/**
 * A value shown on the tombstone page of a withdrawn item.
 */
interface WithdrawnTombstoneEntry {
  // i18n key of the label shown in front of the value
  label: string;
  value: string;
  // When set, the value is rendered as a link pointing to this url
  url?: string;
}

/**
 * Component rendering, on the page of a withdrawn item, the metadata listed in the
 * `item.withdrawn.itemView` configuration: typically why the item has been withdrawn and
 * where its content has moved to, but anything the repository configures is rendered the
 * same way, in the configured order.
 *
 * Only the metadata the REST layer exposes for withdrawn items is available here, see the
 * `item.withdrawn.publicField` configuration property on the backend.
 */
@Component({
  selector: 'ds-item-withdrawn-tombstone',
  templateUrl: './item-withdrawn-tombstone.component.html',
  styleUrls: ['./item-withdrawn-tombstone.component.scss'],
  imports: [
    TranslateModule,
  ],
})
export class ItemWithdrawnTombstoneComponent implements OnChanges {

  /**
   * The withdrawn item
   */
  @Input() item: Item;

  /**
   * The values to render, in the configured order
   */
  entries: WithdrawnTombstoneEntry[] = [];

  constructor(@Inject(APP_CONFIG) protected appConfig: AppConfig) {
  }

  ngOnChanges(): void {
    this.entries = this.buildEntries();
  }

  /**
   * Whether there is anything to render
   */
  hasEntries(): boolean {
    return isNotEmpty(this.entries);
  }

  /**
   * Builds the list of values to render out of the configured fields, skipping the ones
   * the item does not carry, or the current user cannot read.
   */
  protected buildEntries(): WithdrawnTombstoneEntry[] {
    if (!hasValue(this.item)) {
      return [];
    }

    const config = this.appConfig.item.withdrawn;

    return resolveWithdrawnFields(config?.itemView, config?.fields)
      .map((field: WithdrawnFieldConfig) => {
        const value = this.item.firstMetadataValue(field.metadata);
        if (!isNotEmpty(value)) {
          return null;
        }
        const isLink = field.type === 'url' && isAbsoluteUrl(value);
        return {
          label: withdrawnFieldLabelKey(field.metadata),
          value: value,
          url: isLink ? value : undefined,
        } as WithdrawnTombstoneEntry;
      })
      .filter((entry: WithdrawnTombstoneEntry) => hasValue(entry));
  }
}
