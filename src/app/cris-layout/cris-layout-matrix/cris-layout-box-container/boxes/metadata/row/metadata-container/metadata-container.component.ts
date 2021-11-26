import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { RenderingTypeModelComponent } from '../../components/rendering-type.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { Box } from '../../../../../../../core/layout/models/box.model';
import { LayoutField } from '../../../../../../../core/layout/models/metadata-component.model';
import {
  FieldRenderingType,
  getMetadataBoxFieldRendering,
  MetadataBoxFieldRenderOptions
} from '../../components/metadata-box.decorator';
import { hasValue, isEmpty, isNotEmpty } from '../../../../../../../shared/empty.util';
import { GenericConstructor } from '../../../../../../../core/shared/generic-constructor';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-metadata-container',
  templateUrl: './metadata-container.component.html',
  styleUrls: ['./metadata-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetadataContainerComponent extends RenderingTypeModelComponent implements OnInit {

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

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild('metadataValueContainer', {
    static: true,
    read: ViewContainerRef
  }) metadataValueContainerViewRef: ViewContainerRef;

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild('metadataStructuredContainer', {
    static: true,
    read: ViewContainerRef
  }) metadataStructuredContainerViewRef: ViewContainerRef;

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
    super(translateService);
  }

  ngOnInit() {
    console.log(this.field);

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

  getComponentInjector(metadataValue?: any) {
    const providers = [
      { provide: 'fieldProvider', useValue: this.field, deps: [] },
      { provide: 'itemProvider', useValue: this.item, deps: [] },
      { provide: 'renderingSubTypeProvider', useValue: this.renderingSubType, deps: [] }
    ];
    if (isNotEmpty(metadataValue)) {
      providers.push({ provide: 'metadataValueProvider', useValue: metadataValue, deps: [] });
    }

    return Injector.create({
      providers: providers,
      parent: this.injector
    });
  }

  getComponentRef(): GenericConstructor<Component> {
    return this.metadataFieldRenderOptions.componentRef;
  }
}
