import {
  MetadataMapInterface,
  MetadataValue,
} from '@dspace/core/shared/metadata.models';
import { Metadata } from '@dspace/core/shared/metadata.utils';

/**
 * Returns metadata values, replacing plain values with highlighted values when they match.
 */
export function allMetadataWithHitHighlights(
  metadata: MetadataMapInterface,
  hitHighlights: MetadataMapInterface,
  keyOrKeys: string | string[],
): MetadataValue[] {
  const dsoMetadata: MetadataValue[] = Metadata.all(metadata, keyOrKeys);
  const highlights: MetadataValue[] = Metadata.all(hitHighlights ?? {}, keyOrKeys);
  const removedHighlights: string[] = highlights.map((mv) => mv.value.replace(/<\/?em>/g, ''));

  for (let i = 0; i < removedHighlights.length; i++) {
    const index = dsoMetadata.findIndex((mv) => mv.value === removedHighlights[i]);
    if (index !== -1) {
      dsoMetadata[index] = Object.assign(new MetadataValue(), highlights[i], { language: dsoMetadata[index]?.language });
    }
  }

  return dsoMetadata;
}

/**
 * Returns the first metadata value, preferring highlighted values when available.
 */
export function firstMetadataWithHitHighlights(
  metadata: MetadataMapInterface,
  hitHighlights: MetadataMapInterface,
  keyOrKeys: string | string[],
): MetadataValue {
  return Metadata.first(metadata, keyOrKeys, hitHighlights ?? {});
}

