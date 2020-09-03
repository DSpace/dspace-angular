import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { CrisLayoutLoaderDirective } from 'src/app/layout/directives/cris-layout-loader.directive';
import { GenericConstructor } from 'src/app/core/shared/generic-constructor';
import { getMetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { Item } from 'src/app/core/shared/item.model';
import { LayoutBox } from 'src/app/layout/enums/layout-box.enum';
import { Box } from 'src/app/core/layout/models/box.model';
import { Row } from 'src/app/core/layout/models/metadata-component.model';
import { hasValue } from 'src/app/shared/empty.util';

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
      // If the rendering type is null renders its as a text field
      let rendering = hasValue(field.rendering) ? field.rendering : FieldRendetingType.TEXT;
      // Check if the current rendering has subtype
      let subtype: string;
      if (field.rendering.indexOf('.') > -1) {
        const values = field.rendering.split('.');
        rendering = values[0];
        subtype = values[1];
      }
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        this.getComponent(rendering)
      );
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
    });
  }

  getComponent(fieldRenderingType: string): GenericConstructor<Component> {
    return getMetadataBoxFieldRendering(fieldRenderingType);
  }

}
