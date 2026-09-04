import { Component } from '@angular/core';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';

export enum AttachmentRenderingType {
  DOWNLOAD = 'DOWNLOAD',
  IIIF = 'IIIF',
  PDF = 'PDF'
}

/**
 * Registry of attachment rendering types to their corresponding component constructors.
 *
 * Entries are added dynamically at class-definition time by the
 * {@link attachmentTypeRendering} decorator, instead of being hardcoded here.
 */
const attachmentComponentMap = new Map<string, GenericConstructor<Component>>();

/**
 * Decorator that registers a component as the renderer for a given attachment type.
 *
 * @param objectType The attachment rendering type this component handles
 */
export function attachmentTypeRendering(objectType: AttachmentRenderingType) {
  return function decorator(component: any) {
    if (objectType) {
      attachmentComponentMap.set(objectType, component);
    }
  };
}

/**
 * Retrieve the component registered for a given attachment rendering type.
 *
 * @param objectType The rendering type string (case-insensitive)
 * @returns The component constructor, or undefined if not registered
 */
export function getAttachmentTypeRendering(objectType: string): GenericConstructor<Component> | undefined {
  return attachmentComponentMap.get(objectType.toUpperCase());
}
