import { LocaleService, LANG_ORIGIN } from './locale.service';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, of as observableOf } from 'rxjs';
import { take, flatMap, map } from 'rxjs/operators';
import { isNotEmpty, isEmpty } from 'src/app/shared/empty.util';

@Injectable()
export class ServerLocaleService extends LocaleService {

  /**
   * Get the languages list of the user in Accept-Language format
   *
   * @returns {Observable<string[]>}
   */
  getLanguageCodeList(): Observable<string[]> {
    const obs$ = combineLatest([
      this.authService.isAuthenticated(),
      this.authService.isAuthenticationLoaded()
    ]);

    return obs$.pipe(
      take(1),
      flatMap(([isAuthenticated, isLoaded]) => {
        let epersonLang$: Observable<string[]> = observableOf([]);
        if (isAuthenticated && isLoaded) {
          epersonLang$ = this.authService.getAuthenticatedUserFromStore().pipe(
            take(1),
            map((eperson) => {
              const languages: string[] = [];
              const ePersonLang = eperson.firstMetadataValue(this.EPERSON_LANG_METADATA);
              if (ePersonLang) {
                languages.push(...this.setQuality(
                  [ePersonLang],
                  LANG_ORIGIN.EPERSON,
                  !isEmpty(this.translate.currentLang)));
              }
              return languages;
            })
          );
        }
        return epersonLang$.pipe(
          map((epersonLang: string[]) => {
            const languages: string[] = [];
            if (this.translate.currentLang) {
              languages.push(...this.setQuality(
                [this.translate.currentLang],
                LANG_ORIGIN.UI,
                false));
            }
            if (isNotEmpty(epersonLang)) {
              languages.push(...epersonLang);
            }
            return languages;
          })
        )
      })
    );
  }

}
