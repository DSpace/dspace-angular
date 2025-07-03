import { Component } from '@angular/core';

import { RENDER_SECTION_FOR_MAP } from '../../../decorator-registries/render-section-for-registry';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { hasValue } from '../../shared/empty.util';
import {
  DEFAULT_THEME,
  getMatch,
} from '../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { SectionsType } from './sections-type';

export function renderSectionFor(sectionType: SectionsType, theme = DEFAULT_THEME) {
  return function decorator(objectElement: any): void {
  };
}

export function rendersSectionType(sectionType: SectionsType, theme: string, registry = RENDER_SECTION_FOR_MAP): Promise<GenericConstructor<Component>> {
  const match = getMatch(registry, [sectionType, theme], [SectionsType.SubmissionForm, DEFAULT_THEME]);
  return hasValue(match) ? match.match() : undefined;
}
