
import { SectionsType } from './sections-type';

const submissionSectionsMap = new Map();
// TAMU Customization - map sections by theme
export function renderSectionFor(sectionType: SectionsType, theme: string = 'dspace') {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    let themedMap = submissionSectionsMap.get(theme);
    if (themedMap === undefined) {
      themedMap = new Map();
      submissionSectionsMap.set(theme, themedMap);
    }
    themedMap.set(sectionType, objectElement);
  };
}

// TAMU Customization - get sections mapped by theme
export function rendersSectionType(sectionType: SectionsType, theme: string = 'dspace') {
  let themedMap = submissionSectionsMap.get(theme);
  if (themedMap === undefined || !themedMap.has(sectionType)) {
    themedMap = submissionSectionsMap.get('dspace');
  }
  return themedMap.get(sectionType);
}
