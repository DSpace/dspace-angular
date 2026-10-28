import {
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Returns the appropriate placeholder image URL for a given DSpace entity type.
 * This utility is used throughout the application to display default/placeholder images
 * when entity thumbnails are not available or while they are loading.
 *
 * The method follows this resolution strategy:
 * 1. If no entityType is provided, returns the generic file placeholder
 * 2. Attempts to load an entity-specific placeholder (e.g., 'person-plsubmission-edit.component.tsaceholder.svg', 'orgunit-placeholder.svg')
 * 3. If the entity-specific placeholder doesn't exist, falls back to the generic file placeholder
 *
 * @param entityType The DSpace entity type (e.g., 'Person', 'OrgUnit', 'Project').
 *                   Case-insensitive as it will be converted to lowercase.
 */
export const getDefaultImageUrlByEntityType = (entityType: string): Observable<string> => {
  const fallbackImage = 'assets/images/file-placeholder.svg';

  if (!entityType) {
    return of(fallbackImage);
  }

  const defaultImage = `assets/images/${entityType.toLowerCase()}-placeholder.svg`;
  return checkImageExists(defaultImage).pipe(map((exists) => exists ? defaultImage : fallbackImage));
};

const checkImageExists = (url: string): Observable<boolean> =>  {
  return new Observable<boolean>((observer) => {
    const img = new Image();

    img.onload = () => {
      observer.next(true);
      observer.complete();
    };

    img.onerror = () => {
      observer.next(false);
      observer.complete();
    };

    img.src = url;
  });
};
