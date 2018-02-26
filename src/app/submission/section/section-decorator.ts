
import { SectionType } from './section-type';

const submissionSectionsMap = new Map();
export function renderSectionFor(sectionType: SectionType) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    submissionSectionsMap.set(sectionType, objectElement);
  };
}

export function rendersSectionType(sectionType: SectionType) {
  return submissionSectionsMap.get(sectionType);
}
