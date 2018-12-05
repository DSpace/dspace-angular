import { SectionType } from './initial-menus-state';

const menuSectionTypeComponentMap = new Map();

export function rendersSectionForType(type: SectionType) {
  return function decorator(sectionComponent: any) {
    if (!sectionComponent) {
      return;
    }
    menuSectionTypeComponentMap.set(type, sectionComponent);
  };
}

export function getComponentForSectionType(type: SectionType) {
  return menuSectionTypeComponentMap.get(type);
}
