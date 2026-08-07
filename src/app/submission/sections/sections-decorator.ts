import { Component } from '@angular/core';
import { SectionsType } from '@dspace/core/submission/sections-type';
import { hasValue } from '@dspace/shared/utils/empty.util';

import { RENDER_SECTION_FOR_MAP } from '../../../decorator-registries/render-section-for-registry';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import {
  DEFAULT_THEME,
  getMatch,
} from '../../shared/object-collection/shared/listable-object/listable-object.decorator';

export function renderSectionFor(sectionType: SectionsType, theme = DEFAULT_THEME) {
  return function decorator(objectElement: any): void {
  };
}

export function rendersSectionType(sectionType: SectionsType, theme: string, registry = RENDER_SECTION_FOR_MAP): Promise<GenericConstructor<Component>> {
  const match = getMatch(registry, [sectionType, theme], [SectionsType.SubmissionForm, DEFAULT_THEME]);
  return hasValue(match) ? match.match() : undefined;
}
