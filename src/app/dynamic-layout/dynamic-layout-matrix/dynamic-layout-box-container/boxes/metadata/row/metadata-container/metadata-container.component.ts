
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { DYNAMIC_FIELD_RENDERING_MAP } from '@dspace/config/app-config.interface';
import {
  BitstreamDataService,
  MetadataFilter,
} from '@dspace/core/data/bitstream-data.service';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import {
  DynamicLayoutBox,
  LayoutField,
  LayoutFieldType,
} from '@dspace/core/layout/models/box.model';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { Item } from '@dspace/core/shared/item.model';
import MetadataValue from '@dspace/core/shared/metadata.models';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { environment } from '../../../../../../../../environments/environment';
import { FieldRenderingType } from '../../rendering-types/field-rendering-type';
import {
  computeRenderingFn,
  getMetadataBoxFieldRenderOptionsFn,
} from '../../rendering-types/metadata-box.decorator';
import { MetadataBoxFieldRenderOptions } from '../../rendering-types/rendering-type.model';
import { MetadataRenderComponent } from './metadata-render/metadata-render.component';

@Component({
  selector: 'ds-metadata-container',
  templateUrl: './metadata-container.component.html',
  styleUrls: ['./metadata-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MetadataRenderComponent,
  ],
})
export class MetadataContainerComponent implements OnInit {
  /**
   * Current DSpace Item
   */
  @Input() item: Item;
  /**
   * Current layout box
   */
  @Input() box: DynamicLayoutBox;
  /**
   * The metadata field to render
   */
  @Input() field: LayoutField;
  /**
   * The tab name
   */
  @Input() tabName: string;

  /**
   * The prefix used for box field label's i18n key
   */
  readonly fieldI18nPrefix = 'layout.field.label';

  /**
   * A boolean representing if metadata rendering type is structured or not
   */
  isStructured = false;

  /**
   * The configuration of the rendering component to render
   */
  metadataFieldRenderOptions: MetadataBoxFieldRenderOptions;

  protected readonly bitstreamDataService = inject(BitstreamDataService);
  protected readonly translateService = inject(TranslateService);
  protected readonly cd = inject(ChangeDetectorRef);
  protected readonly layoutBoxesMap: Map<FieldRenderingType, MetadataBoxFieldRenderOptions> = inject(DYNAMIC_FIELD_RENDERING_MAP);

  /**
   * Returns all metadata values in the item
   */
  get metadataValues(): MetadataValue[] {
    return this.field.metadata ? this.item.allMetadata(this.field.metadata) : [];
  }

  /**
   * Returns true if the field has label, false otherwise
   */
  get hasLabel(): boolean {
    return hasValue(this.field.label);
  }

  /**
   * Returns a string representing the label of field if exists
   */
  getLabel(): string {
    if (this.field.fieldType === LayoutFieldType.BITSTREAM.toString()) {
      return (hasValue(this.field.bitstream.metadataValue) ?
        this.getTranslationIfExists(`${this.fieldI18nPrefix}.${this.item.entityType}.BITSTREAM[${this.field.bitstream.metadataValue}]`) :
        this.getTranslationIfExists(`${this.fieldI18nPrefix}.${this.item.entityType}.BITSTREAM`)
      ) ?? this.field.label;
    } else {
      return this.getTranslationIfExists(`${this.fieldI18nPrefix}.${this.item.entityType}.[${this.field.metadata}]`) ??
      this.getTranslationIfExists(`${this.fieldI18nPrefix}.${this.item.entityType}.${this.field.metadata}`) ?? // old syntax - do not use
      this.getTranslationIfExists(`${this.fieldI18nPrefix}.[${this.field.metadata}]`) ??
      this.getTranslationIfExists(`${this.fieldI18nPrefix}.${this.field.label}`) ?? // old syntax - do not use
      this.field.label; // the untranslated value from the dynamic layout
    }
  }

  /**
   * Return the translated label, if exists, otherwise returns null
   */
  getTranslationIfExists(key: string): string {
    const translation: string = this.translateService.instant(key);
    return translation !== key ? translation : null;
  }

  /**
   * Returns a string representing the style of field container if exists
   */
  get containerStyle(): string {
    return this.field.style;
  }

  /**
   * Returns a string representing the style of field label if exists, default value otherwise
   */
  get labelStyle(): string {
    const defaultCol = environment.layout.metadataBox.defaultMetadataLabelColStyle;
    return (isNotEmpty(this.field.styleLabel) && this.field.styleLabel.includes('col'))
      ? this.field.styleLabel : `${defaultCol} ${this.field.styleLabel}`;
  }

  ngOnInit() {
    const rendering = computeRenderingFn(this.field?.rendering);
    if (this.field.fieldType === LayoutFieldType.BITSTREAM.toString()
      && (rendering.toLocaleLowerCase() === FieldRenderingType.ATTACHMENT.toLocaleLowerCase()
        || rendering.toLocaleLowerCase() === FieldRenderingType.ADVANCEDATTACHMENT.toLocaleLowerCase())) {
      this.hasBitstream().pipe(take(1)).subscribe((hasBitstream: boolean) => {
        if (hasBitstream) {
          this.initRenderOptions(rendering);
        }
      });
    } else if (this.hasFieldMetadataComponent(this.field)) {
      this.initRenderOptions(rendering);
    }
  }

  initRenderOptions(renderingType: string | FieldRenderingType): void {
    this.metadataFieldRenderOptions = getMetadataBoxFieldRenderOptionsFn(this.layoutBoxesMap, renderingType);
    this.isStructured = this.metadataFieldRenderOptions.structured;
    this.cd.detectChanges();
  }

  hasBitstream(): Observable<boolean> {
    const filters: MetadataFilter[] = [];
    if (isNotEmpty(this.field.bitstream.metadataValue)) {
      filters.push({
        metadataName: this.field.bitstream.metadataField,
        metadataValue: this.field.bitstream.metadataValue,
      });
    }
    return this.bitstreamDataService.findShowableBitstreamsByItem(this.item.uuid, this.field.bitstream.bundle, filters, {}, false)
      .pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<PaginatedList<Bitstream>>) => {
          return response.hasSucceeded && response.payload.page.length > 0;
        }),
      );
  }

  hasFieldMetadataComponent(field: LayoutField) {
    // if it is metadata-group and none of the nested metadata has values then don't generate the component
    let existOneMetadataWithValue = false;
    if (field.fieldType === LayoutFieldType.METADATAGROUP.toString()) {
      field.metadataGroup.elements.forEach(el => {
        if (this.item.metadata[el.metadata]) {
          existOneMetadataWithValue = true;
        }
      });
    }
    return (this.field.fieldType === LayoutFieldType.BITSTREAM.toString()) ||
      (field.fieldType === LayoutFieldType.METADATAGROUP.toString() && existOneMetadataWithValue) ||
      (field.fieldType === LayoutFieldType.METADATA.toString() && this.item.firstMetadataValue(field.metadata));
  }

}
