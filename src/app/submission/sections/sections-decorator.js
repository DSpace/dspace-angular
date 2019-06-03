var submissionSectionsMap = new Map();
export function renderSectionFor(sectionType) {
    return function decorator(objectElement) {
        if (!objectElement) {
            return;
        }
        submissionSectionsMap.set(sectionType, objectElement);
    };
}
export function rendersSectionType(sectionType) {
    return submissionSectionsMap.get(sectionType);
}
//# sourceMappingURL=sections-decorator.js.map