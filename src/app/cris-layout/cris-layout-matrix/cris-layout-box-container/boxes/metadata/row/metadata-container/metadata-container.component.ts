import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../../../../core/shared/item.model';
import { CrisLayoutBox, LayoutField, LayoutFieldType } from '../../../../../../../core/layout/models/box.model';
import {
  FieldRenderingType,
  getMetadataBoxFieldRendering,
  MetadataBoxFieldRenderOptions,
} from '../../rendering-types/metadata-box.decorator';
import { hasValue, isEmpty, isNotEmpty } from '../../../../../../../shared/empty.util';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../../../environments/environment';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { getFirstCompletedRemoteData } from '../../../../../../../core/shared/operators';
import { map, take } from 'rxjs/operators';
import { BitstreamDataService, MetadataFilter } from '../../../../../../../core/data/bitstream-data.service';
import { RemoteData } from '../../../../../../../core/data/remote-data';
import { PaginatedList } from '../../../../../../../core/data/paginated-list.model';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

@Component({
  selector: 'ds-metadata-container',
  templateUrl: './metadata-container.component.html',
  styleUrls: ['./metadata-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetadataContainerComponent implements OnInit {
  /**
   * Current DSpace Item
   */
  @Input() item: Item;
  /**
   * Current layout box
   */
  @Input() box: CrisLayoutBox;
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
    if (this.field.fieldType === LayoutFieldType.BITSTREAM) {
      return (hasValue(this.field.bitstream.metadataValue) ?
        this.getTranslationIfExists(`${this.fieldI18nPrefix}.${this.item.entityType}.BITSTREAM[${this.field.bitstream.metadataValue}]`) :
        this.getTranslationIfExists(`${this.fieldI18nPrefix}.${this.item.entityType}.BITSTREAM`)
      ) ?? this.field.label;
    } else {
      return this.getTranslationIfExists(`${this.fieldI18nPrefix}.${this.item.entityType}.[${this.field.metadata}]`) ??
      this.getTranslationIfExists(`${this.fieldI18nPrefix}.${this.item.entityType}.${this.field.metadata}`) ?? // old syntax - do not use
      this.getTranslationIfExists(`${this.fieldI18nPrefix}.[${this.field.metadata}]`) ??
      this.getTranslationIfExists(`${this.fieldI18nPrefix}.${this.field.label}`) ?? // old syntax - do not use
      this.field.label; // the untranslated value from the CRIS layout
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
    const defaultCol = environment.crisLayout.metadataBox.defaultMetadataLabelColStyle;
    return (isNotEmpty(this.field.styleLabel) && this.field.styleLabel.includes('col'))
      ? this.field.styleLabel : `${defaultCol} ${this.field.styleLabel}`;
  }

  ngOnInit() {
    const rendering = this.computeRendering(this.field);
    if (this.field.fieldType === LayoutFieldType.BITSTREAM
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
    this.metadataFieldRenderOptions = this.getMetadataBoxFieldRenderOptions(renderingType);
    this.isStructured = this.metadataFieldRenderOptions.structured;
    this.cd.detectChanges();
  }

  hasBitstream(): Observable<boolean> {
    let filters: MetadataFilter[] = [];
    if (isNotEmpty(this.field.bitstream.metadataValue)) {
      filters.push({
        metadataName: this.field.bitstream.metadataField,
        metadataValue: this.field.bitstream.metadataValue
      });
    }
    return this.bitstreamDataService.findShowableBitstreamsByItem(this.item.uuid, this.field.bitstream.bundle, filters)
      .pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<PaginatedList<Bitstream>>) => {
          return response.hasSucceeded && response.payload.page.length > 0;
        })
      );
  }

  hasFieldMetadataComponent(field: LayoutField) {
    // if it is metadatagroup and none of the nested metadatas has values then dont generate the component
    let existOneMetadataWithValue = false;
    if (field.fieldType === LayoutFieldType.METADATAGROUP) {
      field.metadataGroup.elements.forEach(el => {
        if (this.item.metadata[el.metadata]) {
          existOneMetadataWithValue = true;
        }
      });
    }
    return (this.field.fieldType === LayoutFieldType.BITSTREAM) ||
      (field.fieldType === LayoutFieldType.METADATAGROUP && existOneMetadataWithValue) ||
      (field.fieldType === LayoutFieldType.METADATA && this.item.firstMetadataValue(field.metadata));
  }

  computeRendering(field: LayoutField): string | FieldRenderingType {
    let rendering = hasValue(field.rendering) ? field.rendering : FieldRenderingType.TEXT;

    if (rendering.indexOf('.') > -1) {
      const values = rendering.split('.');
      rendering = values[0];
    }
    return rendering;
  }

  getMetadataBoxFieldRenderOptions(fieldRenderingType: string): MetadataBoxFieldRenderOptions {
    let renderOptions = getMetadataBoxFieldRendering(fieldRenderingType);
    // If the rendering type not exists will use TEXT type rendering
    if (isEmpty(renderOptions)) {
      renderOptions = getMetadataBoxFieldRendering(FieldRenderingType.TEXT);
    }
    return renderOptions;
  }

  trackUpdate(index, value: string) {
    return value;
  }
}
