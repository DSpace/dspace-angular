
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { ItemVersionsComponent } from '../../item-page/versions/item-versions.component';
import { DynamicLayoutCollectionBoxComponent } from '../dynamic-layout-matrix/dynamic-layout-box-container/boxes/dynamic-layout-collection-box/dynamic-layout-collection-box.component';
import { DynamicLayoutIiifViewerBoxComponent } from '../dynamic-layout-matrix/dynamic-layout-box-container/boxes/iiif-viewer/dynamic-layout-iiif-viewer-box.component';
import { DynamicLayoutMetadataBoxComponent } from '../dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/dynamic-layout-metadata-box.component';
import { DynamicLayoutRelationBoxComponent } from '../dynamic-layout-matrix/dynamic-layout-box-container/boxes/relation/dynamic-layout-relation-box.component';
import { LayoutBox } from '../enums/layout-box.enum';
import { DynamicLayoutBoxDirective } from '../models/dynamic-layout-box-component.directive';

/**
 * Render options for a dynamic layout box component.
 */
export interface DynamicLayoutBoxRenderOptions {
  /** The component class to instantiate for this box type. */
  componentRef: GenericConstructor<DynamicLayoutBoxDirective | ItemVersionsComponent>;
}

/**
 * Static registry mapping {@link LayoutBox} types to their rendering component.
 */
const layoutBoxesMap = new Map<LayoutBox, DynamicLayoutBoxRenderOptions>([
  [LayoutBox.COLLECTIONS, { componentRef: DynamicLayoutCollectionBoxComponent }],
  [LayoutBox.IIIFVIEWER, { componentRef: DynamicLayoutIiifViewerBoxComponent }],
  [LayoutBox.METADATA, { componentRef: DynamicLayoutMetadataBoxComponent }],
  [LayoutBox.RELATION, { componentRef: DynamicLayoutRelationBoxComponent }],
  [LayoutBox.VERSIONING, { componentRef: ItemVersionsComponent }],
]);

/**
 * Resolves the rendering options for a given box type.
 *
 * @param boxType the layout box type to look up
 * @returns the render options for the box type, or undefined if not registered
 */
export function getDynamicLayoutBox(boxType: LayoutBox): DynamicLayoutBoxRenderOptions {
  return layoutBoxesMap.get(boxType);
}
