import {
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

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
