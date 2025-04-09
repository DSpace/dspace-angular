import { Component } from '@angular/core';

import { GenericConstructor } from '../../../../../../../../core/shared/generic-constructor';
import { FileDownloadButtonComponent } from './attachment-render/types/file-download-button/file-download-button.component';

export enum AttachmentRenderingType {
  DOWNLOAD = 'DOWNLOAD',
  IIIF = 'IIIF',
  PDF = 'PDF'
}

const fieldType = new Map();

fieldType.set(AttachmentRenderingType.DOWNLOAD, {
  componentRef: FileDownloadButtonComponent,
  structured: true,
} as AttachmentTypeFieldRenderOptions);


export interface AttachmentTypeFieldRenderOptions {
  componentRef: GenericConstructor<Component>;
  structured: boolean;
}

export function AttachmentTypeRendering(objectType: AttachmentRenderingType, structured = false) {
  return function decorator(component: any) {
    if (objectType) {
      fieldType.set(objectType, {
        componentRef: component,
        structured: structured,
      } as AttachmentTypeFieldRenderOptions);
    }
  };
}

export function getAttachmentTypeRendering(objectType: string): AttachmentTypeFieldRenderOptions {
  return fieldType.get(objectType.toUpperCase());
}
