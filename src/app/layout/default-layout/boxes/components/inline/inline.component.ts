import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { FieldRendetingType, getMetadataBoxFieldRendering, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeModelComponent } from '../rendering-type.model';
import { LayoutField } from '../../../../../core/layout/models/metadata-component.model';
import { hasValue } from '../../../../../shared/empty.util';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { GenericConstructor } from '../../../../../core/shared/generic-constructor';

/**
 * This component renders the inline  metadata group fields
 */

@Component({
  selector: 'ds-inline',
  templateUrl: './inline.component.html',
  styleUrls: ['./inline.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.INLINE)
export class InlineComponent extends RenderingTypeModelComponent implements OnInit {
  /**
   * This property is true if the current row containes a thumbnail, false otherwise
   */
  hasThumbnail = false;

  constructor(protected componentFactoryResolver: ComponentFactoryResolver) {
    super();
  }
  /**
   * Directive hook used to place the dynamic child component
   */

  @ViewChild('metadataContainer', {static: true, read: ViewContainerRef}) metadataContainerViewRef: ViewContainerRef;

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild('thumbnailContainer', {static: true, read: ViewContainerRef}) thumbnailContainerViewRef: ViewContainerRef;

  ngOnInit(): void {
    this.metadataContainerViewRef.clear();
    this.thumbnailContainerViewRef.clear();
    this.field.metadataGroup.elements
      .filter(field => this.hasFieldMetadataComponent(field))
      .forEach((field) => {
        const rendering = this.computeRendering(field);
        const subtype = this.computeSubType(rendering);
        const factory = this.computeComponentFactory(rendering);
        const metadataComponentRef = this.generateComponentRef(factory, field, rendering);
        this.populateComponent(metadataComponentRef, field, subtype);
      });
  }
  hasFieldMetadataComponent(field: LayoutField) {
    return field.fieldType === 'BITSTREAM' ||
      (field.fieldType === 'METADATA' && this.item.firstMetadataValue(field.metadata));
  }
  computeRendering(field: LayoutField): string | FieldRendetingType {
    let rendering = hasValue(field.rendering) ? field.rendering : FieldRendetingType.TEXT;
    if (rendering.indexOf('.') > -1) {
      const values = rendering.split('.');
      rendering = values[0];
    }
    return rendering;
  }
  computeSubType(rendering: string | FieldRendetingType): string {
    let subtype: string;
    if (rendering.indexOf('.') > -1) {
      const values = rendering.split('.');
      subtype = values[1];
    }
    return subtype;
  }
  computeComponentFactory(rendering: string | FieldRendetingType): ComponentFactory<any> {
    let factory = this.componentFactoryResolver.resolveComponentFactory(
      this.getComponent(rendering)
    );
    // If the rendering type not exists will use TEXT type rendering
    if (!hasValue(factory)) {
      factory = this.componentFactoryResolver.resolveComponentFactory(
        this.getComponent(FieldRendetingType.TEXT)
      );
    }
    return factory;
  }
  generateComponentRef(factory: ComponentFactory<any>, field: LayoutField, rendering: string | FieldRendetingType): ComponentRef<any> {
    let metadataRef: ComponentRef<Component>;
    if (field.fieldType !== LayoutBox.METADATA &&
      rendering.toUpperCase() === FieldRendetingType.THUMBNAIL) {
      this.hasThumbnail = true;
      // Create rendering component instance
      metadataRef = this.thumbnailContainerViewRef.createComponent(factory);
    } else {
      // Create rendering component instance
      metadataRef = this.metadataContainerViewRef.createComponent(factory);
    }
    return metadataRef;
  }
  populateComponent(metadataRef: ComponentRef<Component>, field, subtype) {
    (metadataRef.instance as any).item = this.item;
    (metadataRef.instance as any).nested = true;
    (metadataRef.instance as any).field = field;
    (metadataRef.instance as any).subtype = subtype;
  }
  getComponent(fieldRenderingType: string): GenericConstructor<Component> {
    return getMetadataBoxFieldRendering(fieldRenderingType);
  }
}
