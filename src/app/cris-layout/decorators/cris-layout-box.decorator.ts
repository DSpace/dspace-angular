import { Component } from '@angular/core';

import { GenericConstructor } from '../../core/shared/generic-constructor';
import { ItemVersionsComponent } from '../../item-page/versions/item-versions.component';
import { hasNoValue } from '../../shared/empty.util';
import { CrisLayoutCollectionBoxComponent } from '../cris-layout-matrix/cris-layout-box-container/boxes/cris-layout-collection-box/cris-layout-collection-box.component';
import { CrisLayoutIIIFViewerBoxComponent } from '../cris-layout-matrix/cris-layout-box-container/boxes/iiif-viewer/cris-layout-iiif-viewer-box.component';
import { CrisLayoutMetadataBoxComponent } from '../cris-layout-matrix/cris-layout-box-container/boxes/metadata/cris-layout-metadata-box.component';
import { CrisLayoutMetricsBoxComponent } from '../cris-layout-matrix/cris-layout-box-container/boxes/metrics/cris-layout-metrics-box.component';
import { CrisLayoutRelationBoxComponent } from '../cris-layout-matrix/cris-layout-box-container/boxes/relation/cris-layout-relation-box.component';
import { LayoutBox } from '../enums/layout-box.enum';

const layoutBoxesMap = new Map<LayoutBox, CrisLayoutBoxRenderOptions>();

layoutBoxesMap.set(LayoutBox.COLLECTIONS, {
  componentRef: CrisLayoutCollectionBoxComponent,
  hasOwnContainer: false,
} as CrisLayoutBoxRenderOptions);
layoutBoxesMap.set(LayoutBox.IIIFVIEWER, {
  componentRef: CrisLayoutIIIFViewerBoxComponent,
  hasOwnContainer: false,
} as CrisLayoutBoxRenderOptions);
layoutBoxesMap.set(LayoutBox.METADATA, {
  componentRef: CrisLayoutMetadataBoxComponent,
  hasOwnContainer: false,
} as CrisLayoutBoxRenderOptions);
layoutBoxesMap.set(LayoutBox.METRICS, {
  componentRef: CrisLayoutMetricsBoxComponent,
  hasOwnContainer: true,
} as CrisLayoutBoxRenderOptions);
layoutBoxesMap.set(LayoutBox.RELATION, {
  componentRef: CrisLayoutRelationBoxComponent,
  hasOwnContainer: false,
} as CrisLayoutBoxRenderOptions);
layoutBoxesMap.set(LayoutBox.VERSIONING, {
  componentRef: ItemVersionsComponent,
  hasOwnContainer: false,
} as CrisLayoutBoxRenderOptions);


export interface CrisLayoutBoxRenderOptions {
  componentRef: GenericConstructor<Component>;
  hasOwnContainer: boolean;
}

/**
 * Decorator to register a component as a CrisLayoutBox
 * @param boxType The type of the box
 * @param hasOwnContainer Whether the box should have its own container or not
 * @deprecated
 */
export function RenderCrisLayoutBoxFor(boxType: LayoutBox, hasOwnContainer = false) {
  return function decorator(component: any) {
    if (hasNoValue(boxType)) {
      return;
    }
    if (hasNoValue(layoutBoxesMap.get(boxType))) {
      layoutBoxesMap.set(boxType, {
        componentRef: component,
        hasOwnContainer: hasOwnContainer,
      } as CrisLayoutBoxRenderOptions);
    }
  };
}

export function getCrisLayoutBox(boxType: LayoutBox): CrisLayoutBoxRenderOptions {
  return layoutBoxesMap.get(boxType);
}
