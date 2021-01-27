import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef,
  ComponentFactory
} from '@angular/core';
import { GenericConstructor } from '../../../../../core/shared/generic-constructor';
import { Item } from '../../../../../core/shared/item.model';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { Box } from '../../../../../core/layout/models/box.model';
import { LayoutField, Row } from '../../../../../core/layout/models/metadata-component.model';
import { hasValue } from '../../../../../shared/empty.util';
import { FieldRendetingType, getMetadataBoxFieldRendering } from '../../components/metadata-box.decorator';

/**
 * This component renders the rows of metadata boxes
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: '[ds-row]',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss']
})
export class RowComponent implements OnInit {

  /**
   * Current DSpace Item
   */
  @Input() item: Item;
  /**
   * Current layout box
   */
  @Input() box: Box;
  /**
   * Current row configuration
   */
  @Input() row: Row;

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild('metadataContainer', {static: true, read: ViewContainerRef}) metadataContainerViewRef: ViewContainerRef;

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild('thumbnailContainer', {static: true, read: ViewContainerRef}) thumbnailContainerViewRef: ViewContainerRef;

  /**
   * This property is true if the current row containes a thumbnail, false otherwise
   */
  hasThumbnail = false;

  constructor(protected componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    const fields = this.row.fields;

    this.metadataContainerViewRef.clear();
    this.thumbnailContainerViewRef.clear();
    fields
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

  computeSubType(rendering: string | FieldRendetingType): string {
    let subtype: string;
    if (rendering.indexOf('.') > -1) {
      const values = rendering.split('.');
      subtype = values[1];
    }
    return subtype;
  }

  computeRendering(field: LayoutField): string | FieldRendetingType {
    let rendering = hasValue(field.rendering) ? field.rendering : FieldRendetingType.TEXT;
    if (rendering.indexOf('.') > -1) {
      const values = rendering.split('.');
      rendering = values[0];
    }
    return rendering;
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
    (metadataRef.instance as any).field = field;
    (metadataRef.instance as any).subtype = subtype;
  }

  getComponent(fieldRenderingType: string): GenericConstructor<Component> {
    return getMetadataBoxFieldRendering(fieldRenderingType);
  }

}
