import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { GenericConstructor } from '../../../../../core/shared/generic-constructor';
import { getMetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { Item } from '../../../../../core/shared/item.model';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { Box } from '../../../../../core/layout/models/box.model';
import { Row } from '../../../../../core/layout/models/metadata-component.model';
import { hasValue } from '../../../../../shared/empty.util';

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

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    const fields = this.row.fields;

    this.metadataContainerViewRef.clear();
    this.thumbnailContainerViewRef.clear();
    fields.forEach((field) => {
      if (field.fieldType === 'BITSTREAM' ||
        (field.fieldType === 'METADATA' && this.item.firstMetadataValue(field.metadata) )) {
        // If the rendering type is null renders its as a text field
        let rendering = hasValue(field.rendering) ? field.rendering : FieldRendetingType.TEXT;
        // Check if the current rendering has subtype
        let subtype: string;
        if (rendering.indexOf('.') > -1) {
          const values = rendering.split('.');
          rendering = values[0];
          subtype = values[1];
        }
        let factory = this.componentFactoryResolver.resolveComponentFactory(
          this.getComponent(rendering)
        );
        // If the rendering type not exists will use TEXT type rendering
        if (!hasValue(factory)) {
          factory = this.componentFactoryResolver.resolveComponentFactory(
            this.getComponent(FieldRendetingType.TEXT)
          );
        }
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
        (metadataRef.instance as any).item = this.item;
        (metadataRef.instance as any).field = field;
        (metadataRef.instance as any).subtype = subtype;
      }
    });
  }

  getComponent(fieldRenderingType: string): GenericConstructor<Component> {
    return getMetadataBoxFieldRendering(fieldRenderingType);
  }

}
