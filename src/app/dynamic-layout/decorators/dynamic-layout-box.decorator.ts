import { Component } from '@angular/core';

import { GenericConstructor } from '../../core/shared/generic-constructor';
import { ItemVersionsComponent } from '../../item-page/versions/item-versions.component';
import { DynamicLayoutCollectionBoxComponent } from '../dynamic-layout-matrix/dynamic-layout-box-container/boxes/dynamic-layout-collection-box/dynamic-layout-collection-box.component';
import { DynamicLayoutIiifViewerBoxComponent } from '../dynamic-layout-matrix/dynamic-layout-box-container/boxes/iiif-viewer/dynamic-layout-iiif-viewer-box.component';
import { DynamicLayoutMetadataBoxComponent } from '../dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/dynamic-layout-metadata-box.component';
import { DynamicLayoutRelationBoxComponent } from '../dynamic-layout-matrix/dynamic-layout-box-container/boxes/relation/dynamic-layout-relation-box.component';
import { LayoutBox } from '../enums/layout-box.enum';

export interface DynamicLayoutBoxRenderOptions {
  componentRef: GenericConstructor<Component>;
  hasOwnContainer: boolean;
}

const layoutBoxesMap = new Map<LayoutBox, DynamicLayoutBoxRenderOptions>([
  [ LayoutBox.COLLECTIONS, { componentRef: DynamicLayoutCollectionBoxComponent, hasOwnContainer: false } as DynamicLayoutBoxRenderOptions ],
  [ LayoutBox.IIIFVIEWER, { componentRef: DynamicLayoutIiifViewerBoxComponent, hasOwnContainer: false } as DynamicLayoutBoxRenderOptions ],
  [ LayoutBox.METADATA, { componentRef: DynamicLayoutMetadataBoxComponent, hasOwnContainer: false } as DynamicLayoutBoxRenderOptions ],
  [ LayoutBox.RELATION, { componentRef: DynamicLayoutRelationBoxComponent, hasOwnContainer: false } as DynamicLayoutBoxRenderOptions ],
  [ LayoutBox.VERSIONING, { componentRef: ItemVersionsComponent, hasOwnContainer: false } as DynamicLayoutBoxRenderOptions ],
]);

export function getDynamicLayoutBox(boxType: LayoutBox): DynamicLayoutBoxRenderOptions {
  return layoutBoxesMap.get(boxType);
}
