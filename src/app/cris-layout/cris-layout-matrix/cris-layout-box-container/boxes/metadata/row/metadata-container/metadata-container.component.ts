import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  Input,
  OnInit
} from '@angular/core';
import { Item } from '../../../../../../../core/shared/item.model';
import { Box, LayoutField } from '../../../../../../../core/layout/models/box.model';
import {
  FieldRenderingType,
  getMetadataBoxFieldRendering,
  MetadataBoxFieldRenderOptions
} from '../../rendering-types/metadata-box.decorator';
import { hasValue, isEmpty, isNotEmpty } from '../../../../../../../shared/empty.util';
import { GenericConstructor } from '../../../../../../../core/shared/generic-constructor';
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
  @Input() box: Box;
  /**
   * The metadata field to render
   */
  @Input() field: LayoutField;
  /**
   * a boolean representing if metadata is nested in a structured rendering type
   */
  @Input() nested: boolean;
  injectorObj;

  /**
   * The prefix used for box field label's i18n key
   */
  fieldI18nPrefix = 'layout.field.label.';

  /**
   * A boolean representing if metadata rendering type is structured or not
   */
  isStructured = false;

  metadataFieldRenderOptions: MetadataBoxFieldRenderOptions;

  renderingSubType: string;

  constructor(
    protected componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    protected translateService: TranslateService
  ) {
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

  /**
   * Returns a string representing the style of field value if exists, default value otherwise
   */
  get valueStyle(): string {
    const defaultCol = environment.crisLayout.metadataBox.defaultMetadataLabelColStyle;
    return (isNotEmpty(this.field.styleValue) && this.field.styleValue.includes('col'))
      ? this.field.styleValue : `${defaultCol} ${this.field.styleValue}`;
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

  /**
   * Generate ComponentFactory for Thumbnail rendering
   * @param fieldRenderingType
   */
  computeThumbnailComponentFactory(fieldRenderingType: string | FieldRenderingType): ComponentFactory<any> {
    const constructor: GenericConstructor<Component> = getMetadataBoxFieldRendering(fieldRenderingType)?.componentRef;
    return constructor ? this.componentFactoryResolver.resolveComponentFactory(constructor) : null;
  }

  /**
   * Generate ComponentRef for Thumbnail rendering
   * @param factory
   */
  generateThumbnailComponentRef(factory: ComponentFactory<any>): ComponentRef<any> {
    // let metadataRef: ComponentRef<Component>;
    // metadataRef = this.metadataStructuredContainerViewRef.createComponent(factory, 0, this.getComponentInjector());
    /*    (metadataRef.instance as any).item = this.item;
        (metadataRef.instance as any).itemProvider = this.item;
        (metadataRef.instance as any).field = this.field;
        (metadataRef.instance as any).fieldProvider = this.field;
        (metadataRef.instance as any).renderingSubTypeProvider = this.renderingSubType;*/
    return null;
  }

  trackUpdate(index, value: string) {
    return value;
  }

  getComponentInjector(metadataValue?: any) {
    const providers = [
      { provide: 'fieldProvider', useValue: this.field, deps: [] },
      { provide: 'itemProvider', useValue: this.item, deps: [] },
      { provide: 'renderingSubTypeProvider', useValue: this.renderingSubType, deps: [] }
    ];
    if (isNotEmpty(metadataValue)) {
      providers.push({ provide: 'metadataValueProvider', useValue: metadataValue, deps: [] });
    }

    this.injectorObj = Injector.create({
      providers: providers,
      parent: this.injector
    });

    return this.injectorObj;
  }

  getComponentRef(): GenericConstructor<Component> {
    return this.metadataFieldRenderOptions.componentRef;
  }
}
