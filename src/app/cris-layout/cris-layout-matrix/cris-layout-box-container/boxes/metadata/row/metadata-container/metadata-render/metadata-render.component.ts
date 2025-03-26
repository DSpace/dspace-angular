import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Item } from '../../../../../../../../core/shared/item.model';
import { CrisLayoutBox, LayoutField } from '../../../../../../../../core/layout/models/box.model';
import { GenericConstructor } from '../../../../../../../../core/shared/generic-constructor';
import { hasValue, isEmpty, isNotEmpty } from '../../../../../../../../shared/empty.util';
import {
  FieldRenderingType,
  getMetadataBoxFieldRendering,
  MetadataBoxFieldRenderOptions
} from '../../../rendering-types/metadata-box.decorator';
import {
  PLACEHOLDER_PARENT_METADATA
} from '../../../../../../../../shared/form/builder/ds-dynamic-form-ui/ds-dynamic-form-constants';
import { MetadataValue } from '../../../../../../../../core/shared/metadata.models';

@Component({
  selector: 'ds-metadata-render',
  templateUrl: './metadata-render.component.html',
  styleUrls: ['./metadata-render.component.scss']
})
export class MetadataRenderComponent implements OnInit {

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
   * The metadata value
   */
  @Input() metadataValue: MetadataValue;

  /**
   * The rendering sub-type, if exists
   * e.g. for type identifier.doi this property
   * contains the sub-type doi
   */
  renderingSubType: string;

  /**
   * Directive hook used to place the dynamic render component
   */
  @ViewChild('metadataValue', {
    static: true,
    read: ViewContainerRef
  }) metadataValueViewRef: ViewContainerRef;

  constructor(
    protected componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
  ) {

  }

  ngOnInit(): void {
    this.metadataValueViewRef.clear();
    this.renderingSubType = this.computeSubType(this.field);
    this.generateComponentRef();
  }

  /**
   * Generate ComponentFactory for metadata rendering
   */
  computeComponentFactory(): ComponentFactory<any> {
    const rendering = this.computeRendering();
    const metadataFieldRenderOptions = this.getMetadataBoxFieldRenderOptions(rendering);
    const constructor: GenericConstructor<Component> = metadataFieldRenderOptions?.componentRef;
    return constructor ? this.componentFactoryResolver.resolveComponentFactory(constructor) : null;
  }

  /**
   * Generate ComponentRef for metadata rendering
   */
  generateComponentRef(): ComponentRef<any> {
    let metadataRef: ComponentRef<Component>;
    const factory: ComponentFactory<any> = this.computeComponentFactory();
    metadataRef = this.metadataValueViewRef.createComponent(factory, 0, this.getComponentInjector());
    return metadataRef;
  }

  /**
   * Generate Component Injector object
   */
  getComponentInjector() {
    const providers = [
      { provide: 'fieldProvider', useValue: this.field, deps: [] },
      { provide: 'itemProvider', useValue: this.item, deps: [] },
      { provide: 'renderingSubTypeProvider', useValue: this.renderingSubType, deps: [] },
    ];
    if (isNotEmpty(this.metadataValue)) {
      this.metadataValue = this.normalizeMetadataValue(this.metadataValue);
      providers.push({ provide: 'metadataValueProvider', useValue: (this.metadataValue as any), deps: [] });
    }

    return Injector.create({
      providers: providers,
      parent: this.injector
    });
  }

  /**
   * Return the rendering type of the field to render
   *
   * @return the rendering type
   */
  computeRendering(): string | FieldRenderingType {
    let rendering = hasValue(this.field.rendering) ? this.field.rendering : FieldRenderingType.TEXT;

    if (rendering.indexOf('.') > -1) {
      const values = rendering.split('.');
      rendering = values[0];
    }
    return rendering;
  }

  /**
   * Return the rendering sub-type of the field to render
   *
   * @return the rendering type
   */
  computeSubType(field: LayoutField): string | FieldRenderingType {
    const rendering = field.rendering;
    let subtype: string;

    if (rendering?.indexOf('.') > -1) {
      const values = rendering.split('.');
      subtype = values[1];
    }
    return subtype;
  }

  /**
   * Return the rendering option related to the given rendering type
   * @param fieldRenderingType
   */
  getMetadataBoxFieldRenderOptions(fieldRenderingType: string): MetadataBoxFieldRenderOptions {
    let renderOptions = getMetadataBoxFieldRendering(fieldRenderingType);
    // If the rendering type not exists will use TEXT type rendering
    if (isEmpty(renderOptions)) {
      renderOptions = getMetadataBoxFieldRendering(FieldRenderingType.TEXT);
    }
    return renderOptions;
  }

  /**
   * Normalize value to display.
   * In case the value contains a PLACEHOLDER returns it as blank
   * @param metadataValue
   */
  private normalizeMetadataValue(metadataValue: MetadataValue): MetadataValue {
    const value = metadataValue.value;
    if (isNotEmpty(value) && value.includes(PLACEHOLDER_PARENT_METADATA)) {
      return Object.assign(new MetadataValue(), metadataValue, {
        value: ''
      });
    } else {
      return metadataValue;
    }
  }

}
