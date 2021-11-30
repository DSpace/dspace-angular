import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../../../../core/shared/item.model';
import { CrisLayoutBox, LayoutField } from '../../../../../../../core/layout/models/box.model';
import {
  FieldRenderingType,
  getMetadataBoxFieldRendering,
  MetadataBoxFieldRenderOptions
} from '../../rendering-types/metadata-box.decorator';
import { hasValue, isEmpty, isNotEmpty } from '../../../../../../../shared/empty.util';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../../../environments/environment';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';

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
   * The prefix used for box field label's i18n key
   */
  fieldI18nPrefix = 'layout.field.label.';

  /**
   * A boolean representing if metadata rendering type is structured or not
   */
  isStructured = false;

  /**
   * The configuration of the rendering component to render
   */
  metadataFieldRenderOptions: MetadataBoxFieldRenderOptions;

  /**
   * The rendering sub-type, if exists
   * e.g. for type identifier.doi this property
   * contains the sub-type doi
   */
  renderingSubType: string;

  constructor(protected translateService: TranslateService) {
  }

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
  get label(): string {
    const fieldLabelI18nKey = this.fieldI18nPrefix + this.field.label;
    const header: string = this.translateService.instant(fieldLabelI18nKey);
    if (header === fieldLabelI18nKey) {
      // if translation does not exist return the value present in the header property
      return this.translateService.instant(this.field.label);
    } else {
      return header;
    }
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
    if (this.hasFieldMetadataComponent(this.field)) {
      const rendering = this.computeRendering(this.field);
      this.renderingSubType = this.computeSubType(this.field);
      this.metadataFieldRenderOptions = this.getMetadataBoxFieldRenderOptions(rendering);
      this.isStructured = this.metadataFieldRenderOptions.structured;
    }
  }

  hasFieldMetadataComponent(field: LayoutField) {
    // if it is metadatagroup and none of the nested metadatas has values then dont generate the component
    let existOneMetadataWithValue = false;
    if (field.fieldType === 'METADATAGROUP') {
      field.metadataGroup.elements.forEach(el => {
        if (this.item.metadata[el.metadata]) {
          existOneMetadataWithValue = true;
        }
      });
    }
    return field.fieldType === 'BITSTREAM' || (field.fieldType === 'METADATAGROUP' && existOneMetadataWithValue) ||
      (field.fieldType === 'METADATA' && this.item.firstMetadataValue(field.metadata));
  }

  computeSubType(field: LayoutField): string | FieldRenderingType {
    const rendering = field.rendering;
    let subtype: string;

    if (rendering?.indexOf('.') > -1) {
      const values = rendering.split('.');
      subtype = values[1];
    }
    return subtype;
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
