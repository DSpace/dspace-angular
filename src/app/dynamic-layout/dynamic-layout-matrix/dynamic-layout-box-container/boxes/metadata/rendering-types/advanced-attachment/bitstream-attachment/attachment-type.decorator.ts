import { Component } from '@angular/core';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { hasValue } from '@dspace/shared/utils/empty.util';

import { ATTACHMENT_TYPE_RENDERING_MAP } from '../../../../../../../../../decorator-registries/attachment-type-rendering-registry';

export enum AttachmentRenderingType {
  DOWNLOAD = 'DOWNLOAD',
  IIIF = 'IIIF',
  PDF = 'PDF'
}

/**
 * Marker decorator used to register a component as the renderer for a given {@link AttachmentRenderingType}.
 *
 * @param objectType The attachment rendering type this component handles
 */
export function attachmentTypeRendering(objectType: AttachmentRenderingType) {
  return function decorator(component: GenericConstructor<any>) {
  };
}

/**
 * Retrieve the component registered for a given attachment rendering type.
 *
 * @param objectType The rendering type string (case-insensitive)
 * @param registry the registry containing all the attachment rendering components
 * @returns a promise resolving to the component constructor for the rendering type,
 *          or undefined if not registered
 */
export function getAttachmentTypeRendering(
  objectType: string,
  registry: Map<string, () => Promise<GenericConstructor<Component>>> = ATTACHMENT_TYPE_RENDERING_MAP,
): Promise<GenericConstructor<Component>> | undefined {
  const loader = registry.get(objectType.toUpperCase());
  return hasValue(loader) ? loader() : undefined;
}
