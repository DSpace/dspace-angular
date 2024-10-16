/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { combineLatest, Observable, of as observableOf, } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractMenuProvider, PartialMenuSection, } from '../../menu-provider';

export abstract class AbstractExpandableMenuProvider extends AbstractMenuProvider {

  alwaysRenderExpandable = true;


  abstract getTopSection(): Observable<PartialMenuSection>;

  abstract getSubSections(): Observable<PartialMenuSection[]>;

  protected includeSubSections(): boolean {
    return true;
  }

  getSections(): Observable<PartialMenuSection[]> {
    const full = this.includeSubSections();

    return combineLatest([
      this.getTopSection(),
      full ? this.getSubSections() : observableOf([]),
    ]).pipe(
      map((
        [partialTopSection, partialSubSections]: [PartialMenuSection, PartialMenuSection[]]
      ) => {
        const subSections = partialSubSections.map((partialSub, index) => {
          return {
            ...partialSub,
            id: partialSub.id ?? `${this.menuProviderId}_Sub-${index}`,
            parentID: this.menuProviderId,
          };
        });

        return [
          ...subSections,
          {
            ...partialTopSection,
            id: this.menuProviderId,
          },
        ];
      })
    );
  }
}
