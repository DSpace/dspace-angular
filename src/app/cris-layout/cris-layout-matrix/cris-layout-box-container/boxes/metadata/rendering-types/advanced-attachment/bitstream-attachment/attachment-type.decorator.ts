import { GenericConstructor } from '../../../../../../../../core/shared/generic-constructor';
import { Component } from '@angular/core';

export enum AttachmentRenderingType {
  DOWNLOAD = 'DOWNLOAD',
  IIIF = 'IIIF',
  PDF = 'PDF'
}

const fieldType = new Map();

export interface AttachmentTypeFieldRenderOptions {
  componentRef: GenericConstructor<Component>;
  structured: boolean;
}

export function AttachmentTypeRendering(objectType: AttachmentRenderingType, structured = false) {
  return function decorator(component: any) {
    if (objectType) {
      fieldType.set(objectType, {
        componentRef: component,
        structured: structured
      } as AttachmentTypeFieldRenderOptions);
    }
  };
}

export function getAttachmentTypeRendering(objectType: string): AttachmentTypeFieldRenderOptions {
  return fieldType.get(objectType.toUpperCase());
}
