import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  QueryList,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { FieldRendetingType, getMetadataBoxFieldRendering, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeModelComponent } from '../rendering-type.model';
import { LayoutField } from '../../../../../core/layout/models/metadata-component.model';
import { hasValue } from '../../../../../shared/empty.util';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { GenericConstructor } from '../../../../../core/shared/generic-constructor';

/**
 * This component renders the table  metadata group fields
 */
@Component({
  selector: 'ds-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.TABLE)
export class TableComponent extends RenderingTypeModelComponent implements OnInit, AfterViewInit {
  /**
   * This property is used to hold nested Layout Field inside a metadata group field
   */
  metadataGroup: LayoutField[] = [];

  /**
   * This property is used to hold a list of objects with {nested Layout Field and an index that shows the position of nested field inside metadata group field}
   */
  componentsToBeRendered: any[] = [];

  /**
   * Directive hook used to place the list of dynamic child component
   */

  @ViewChildren('nested', {read: ViewContainerRef}) public metadataContainerViewRef: QueryList<ViewContainerRef>;


  /**
   * Directive hook used to place the list of dynamic child component
   */

  @ViewChildren('nestedthumbnail', {read: ViewContainerRef}) public nestedthumbnail: QueryList<ViewContainerRef>;
  hasThumbnail = false;

  constructor(protected componentFactoryResolver: ComponentFactoryResolver,
              private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.field.metadataGroup.elements.forEach(e => {
      this.metadataGroup.push(e);

    });
    this.metadataValues.forEach((mdv, index) => {
      this.metadataGroup.forEach(mdg => {
        const dataInputForComponentRef = {
          index: index,
          field: mdg
        };
        this.componentsToBeRendered.push(dataInputForComponentRef);
      });
    });
  }

  ngAfterViewInit() {
    this.componentsToBeRendered
      .filter(field => this.hasFieldMetadataComponent(field.field))
      .forEach((field, index) => {
        const rendering = this.computeRendering(field.field);
        const subtype = this.computeSubType(rendering);
        const factory = this.computeComponentFactory(rendering);
        const metadataComponentRef = this.generateComponentRef(factory, field.field, rendering, index);
        this.populateComponent(metadataComponentRef, field, subtype);
      });
    this.ref.detectChanges();
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

  generateComponentRef(factory: ComponentFactory<any>, field: LayoutField, rendering: string | FieldRendetingType, index: number): ComponentRef<any> {
    let metadataRef: ComponentRef<Component>;
    if (field.fieldType !== LayoutBox.METADATA &&
      rendering.toUpperCase() === FieldRendetingType.THUMBNAIL) {
      this.hasThumbnail = true;
      // Create rendering component instance
      metadataRef = this.nestedthumbnail.toArray()[index].createComponent(factory);
    } else {
      // Create rendering component instance
      metadataRef = this.metadataContainerViewRef.toArray()[index].createComponent(factory);
    }
    return metadataRef;
  }

  getComponent(fieldRenderingType: string): GenericConstructor<Component> {
    return getMetadataBoxFieldRendering(fieldRenderingType);
  }

  hasFieldMetadataComponent(field: LayoutField) {
    return field.fieldType === 'BITSTREAM' || field.fieldType === 'METADATAGROUP' ||
      (field.fieldType === 'METADATA' && this.item.firstMetadataValue(field.metadata));
  }

  populateComponent(metadataRef: ComponentRef<Component>, field, subtype) {
    (metadataRef.instance as any).item = this.item;
    (metadataRef.instance as any).field = field.field;
    (metadataRef.instance as any).indexToBeRendered = field.index;
    (metadataRef.instance as any).subtype = subtype;
    (metadataRef.instance as any).nested = true;
  }
}
