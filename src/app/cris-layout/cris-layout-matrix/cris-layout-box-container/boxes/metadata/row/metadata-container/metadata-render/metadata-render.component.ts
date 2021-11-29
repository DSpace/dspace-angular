import {
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  Input,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Item } from '../../../../../../../../core/shared/item.model';
import { Box, LayoutField } from '../../../../../../../../core/layout/models/box.model';
import { GenericConstructor } from '../../../../../../../../core/shared/generic-constructor';
import { hasValue, isEmpty, isNotEmpty } from '../../../../../../../../shared/empty.util';
import {
  FieldRenderingType,
  getMetadataBoxFieldRendering,
  MetadataBoxFieldRenderOptions
} from '../../../rendering-types/metadata-box.decorator';

@Component({
  selector: 'ds-metadata-render',
  templateUrl: './metadata-render.component.html',
  styleUrls: ['./metadata-render.component.scss']
})
export class MetadataRenderComponent {

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
   * The metadata value
   */
  @Input() metadataValue: any;
  /**
   * The rendering sub type, if exists
   */
  @Input() renderingSubType: string;

  /**
   * Directive hook used to place the dynamic render component
   */
  @ViewChild('metadataValue', {
    static: true,
    read: ViewContainerRef
  }) metadataValueViewRef: ViewContainerRef;

  constructor(
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected cdr: ChangeDetectorRef,
    private injector: Injector,
  ) {

  }

  ngAfterViewInit(): void {
    this.metadataValueViewRef.clear();
    this.generateComponentRef();
    this.cdr.detectChanges();
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

  getComponentInjector() {
    const providers = [
      { provide: 'fieldProvider', useValue: this.field, deps: [] },
      { provide: 'itemProvider', useValue: this.item, deps: [] },
      { provide: 'renderingSubTypeProvider', useValue: this.renderingSubType, deps: [] }
    ];
    if (isNotEmpty(this.metadataValue)) {
      providers.push({ provide: 'metadataValueProvider', useValue: this.metadataValue, deps: [] });
    }

    return Injector.create({
      providers: providers,
      parent: this.injector
    });
  }

  computeRendering(): string | FieldRenderingType {
    let rendering = hasValue(this.field.rendering) ? this.field.rendering : FieldRenderingType.TEXT;

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

}
