import { Component } from '@angular/core';

import { GenericConstructor } from '../../core/shared/generic-constructor';
import { ItemVersionsComponent } from '../../item-page/versions/item-versions.component';
import { DynamicLayoutCollectionBoxComponent } from '../dynamic-layout-matrix/dynamic-layout-box-container/boxes/dynamic-layout-collection-box/dynamic-layout-collection-box.component';
import { DynamicLayoutIiifViewerBoxComponent } from '../dynamic-layout-matrix/dynamic-layout-box-container/boxes/iiif-viewer/dynamic-layout-iiif-viewer-box.component';
import { DynamicLayoutMetadataBoxComponent } from '../dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/dynamic-layout-metadata-box.component';
import { DynamicLayoutRelationBoxComponent } from '../dynamic-layout-matrix/dynamic-layout-box-container/boxes/relation/dynamic-layout-relation-box.component';
import { LayoutBox } from '../enums/layout-box.enum';

/**
 * Render options for a dynamic layout box component, specifying its Angular component
 * reference and whether it manages its own accordion container.
 */
export interface DynamicLayoutBoxRenderOptions {
  /** The component class to instantiate for this box type. */
  componentRef: GenericConstructor<Component>;
  /** If true, the box provides its own container; the parent won't wrap it in an accordion. */
  hasOwnContainer: boolean;
}

/**
 * Static registry mapping {@link LayoutBox} types to their rendering component and container options.
 */
const layoutBoxesMap = new Map<LayoutBox, DynamicLayoutBoxRenderOptions>([
  [ LayoutBox.COLLECTIONS, { componentRef: DynamicLayoutCollectionBoxComponent, hasOwnContainer: false } as DynamicLayoutBoxRenderOptions ],
  [ LayoutBox.IIIFVIEWER, { componentRef: DynamicLayoutIiifViewerBoxComponent, hasOwnContainer: false } as DynamicLayoutBoxRenderOptions ],
  [ LayoutBox.METADATA, { componentRef: DynamicLayoutMetadataBoxComponent, hasOwnContainer: false } as DynamicLayoutBoxRenderOptions ],
  [ LayoutBox.RELATION, { componentRef: DynamicLayoutRelationBoxComponent, hasOwnContainer: false } as DynamicLayoutBoxRenderOptions ],
  [ LayoutBox.VERSIONING, { componentRef: ItemVersionsComponent, hasOwnContainer: false } as DynamicLayoutBoxRenderOptions ],
]);

/**
 * Resolves the rendering options (component + container flag) for a given box type.
 *
 * @param boxType the layout box type to look up
 * @returns the render options for the box type, or undefined if not registered
 */
export function getDynamicLayoutBox(boxType: LayoutBox): DynamicLayoutBoxRenderOptions {
  return layoutBoxesMap.get(boxType);
}
